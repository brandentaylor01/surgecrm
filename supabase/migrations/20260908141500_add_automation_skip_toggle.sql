-- Add an explicit safety flag for skipping autodial and auto-mail campaigns
alter table public.leads 
add column is_skipped boolean default false;
