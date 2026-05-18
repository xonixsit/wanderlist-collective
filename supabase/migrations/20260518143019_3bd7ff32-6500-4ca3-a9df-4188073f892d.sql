
-- TRIPS
CREATE TABLE public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  location text NOT NULL,
  country text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_key text NOT NULL,
  dates text NOT NULL,
  duration text NOT NULL,
  price integer NOT NULL CHECK (price >= 0),
  total_spots integer NOT NULL CHECK (total_spots > 0),
  spots_left integer NOT NULL CHECK (spots_left >= 0),
  status text NOT NULL DEFAULT 'open',
  trending boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  highlights text[] NOT NULL DEFAULT '{}',
  itinerary jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published trips are viewable by everyone"
  ON public.trips FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert trips"
  ON public.trips FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update trips"
  ON public.trips FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete trips"
  ON public.trips FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- BOOKINGS
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE RESTRICT,
  spots integer NOT NULL DEFAULT 1 CHECK (spots > 0),
  total_paid integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_trip ON public.bookings(trip_id);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own bookings"
  ON public.bookings FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users cancel own bookings"
  ON public.bookings FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage bookings"
  ON public.bookings FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- CREDITS LEDGER
CREATE TABLE public.credits_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  reason text NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_credits_user ON public.credits_ledger(user_id);
ALTER TABLE public.credits_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own credits"
  ON public.credits_ledger FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert credits"
  ON public.credits_ledger FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER trips_touch_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- BOOK TRIP RPC
CREATE OR REPLACE FUNCTION public.book_trip(_trip_id uuid, _spots integer DEFAULT 1)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user uuid := auth.uid();
  _trip public.trips%ROWTYPE;
  _booking_id uuid;
  _total integer;
  _credits integer;
BEGIN
  IF _user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _spots IS NULL OR _spots < 1 THEN RAISE EXCEPTION 'Invalid spots'; END IF;

  SELECT * INTO _trip FROM public.trips WHERE id = _trip_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Trip not found'; END IF;
  IF _trip.spots_left < _spots THEN RAISE EXCEPTION 'Not enough spots'; END IF;

  _total := _trip.price * _spots;
  _credits := (_total / 10);

  INSERT INTO public.bookings (user_id, trip_id, spots, total_paid, status)
  VALUES (_user, _trip_id, _spots, _total, 'confirmed')
  RETURNING id INTO _booking_id;

  UPDATE public.trips
    SET spots_left = spots_left - _spots,
        status = CASE WHEN spots_left - _spots = 0 THEN 'sold-out' ELSE status END
    WHERE id = _trip_id;

  INSERT INTO public.credits_ledger (user_id, amount, reason, booking_id)
  VALUES (_user, _credits, 'Booking: ' || _trip.title, _booking_id);

  RETURN _booking_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.book_trip(uuid, integer) TO authenticated;
