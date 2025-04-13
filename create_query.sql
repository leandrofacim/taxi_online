drop schema if exists ccca cascade;

create schema ccca;

create table ccca.ride_projection (
	ride_id uuid primary key,
	ride_status text,
	account_passenger_name text,
	account_driver_name text,
	ride_fare numeric,
	ride_distance numeric,
	transaction_tid text,
	transaction_status text
);
