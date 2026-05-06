-- Skapa storage buckets
insert into storage.buckets (id, name, public) values ('documents', 'documents', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict do nothing;

-- Storage policies
create policy "Medlemmar kan ladda upp dokument"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documents');

create policy "Alla kan se dokument"
  on storage.objects for select
  using (bucket_id = 'documents');

create policy "Admin kan radera dokument"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'documents' and exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Medlemmar kan ladda upp foton"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photos');

create policy "Alla kan se foton"
  on storage.objects for select
  using (bucket_id = 'photos');