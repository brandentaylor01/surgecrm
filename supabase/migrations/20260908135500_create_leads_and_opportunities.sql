create table public.leads (
    id uuid default gen_random_uuid() primary key,
    account_name text not null,
    contact_name text not null,
    contact_email text not null,
    phone_number text,
    location_details text,
    financial_matrix numeric(12, 2) default 0.00,
    stage text default 'Verified Intake',
    is_wiped boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.leads enable row level security;
create policy "Allow authenticated admin operations" on public.leads for all using (true) with check (true);
