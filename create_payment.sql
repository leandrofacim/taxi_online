drop schema if exists ccca cascade;

create schema ccca;

create table ccca.transaction (
	transaction_id uuid primary key,
	external_id uuid,
	tid text,
	amount numeric,
	status text
);
