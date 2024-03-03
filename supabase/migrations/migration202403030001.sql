create table "public"."evaluation" (
    "id" uuid not null,
    "user_id" uuid not null default auth.uid(),
    "edit" text,
    "feedback" text default ''::text,
    "score" smallint not null,
    "is_helpful" boolean,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."evaluation" enable row level security;

create table "public"."profile" (
    "id" uuid not null,
    "username" text not null default ''::text,
    "first_name" text default ''::text,
    "last_name" text default ''::text,
    "country" text default ''::text,
    "created_at" timestamp with time zone not null default now(),
    "languages_fluent" text[] not null default '{}'::text[]
);


alter table "public"."profile" enable row level security;

create table "public"."submission" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default auth.uid(),
    "language" text not null default ''::text,
    "title" text not null default ''::text,
    "content" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."submission" enable row level security;

CREATE UNIQUE INDEX evaluation_pkey ON public.evaluation USING btree (id, user_id);

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (id);

CREATE UNIQUE INDEX profile_username_key ON public.profile USING btree (username);

CREATE UNIQUE INDEX submission_pkey ON public.submission USING btree (id);

alter table "public"."evaluation" add constraint "evaluation_pkey" PRIMARY KEY using index "evaluation_pkey";

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."submission" add constraint "submission_pkey" PRIMARY KEY using index "submission_pkey";

alter table "public"."evaluation" add constraint "evaluation_id_fkey" FOREIGN KEY (id) REFERENCES submission(id) not valid;

alter table "public"."evaluation" validate constraint "evaluation_id_fkey";

alter table "public"."evaluation" add constraint "evaluation_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."evaluation" validate constraint "evaluation_user_id_fkey";

alter table "public"."profile" add constraint "profile_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."profile" validate constraint "profile_id_fkey";

alter table "public"."profile" add constraint "profile_username_check" CHECK ((length(username) >= 6)) not valid;

alter table "public"."profile" validate constraint "profile_username_check";

alter table "public"."profile" add constraint "profile_username_key" UNIQUE using index "profile_username_key";

alter table "public"."submission" add constraint "submission_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."submission" validate constraint "submission_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profile (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$function$
;

grant delete on table "public"."evaluation" to "anon";

grant insert on table "public"."evaluation" to "anon";

grant references on table "public"."evaluation" to "anon";

grant select on table "public"."evaluation" to "anon";

grant trigger on table "public"."evaluation" to "anon";

grant truncate on table "public"."evaluation" to "anon";

grant update on table "public"."evaluation" to "anon";

grant delete on table "public"."evaluation" to "authenticated";

grant insert on table "public"."evaluation" to "authenticated";

grant references on table "public"."evaluation" to "authenticated";

grant select on table "public"."evaluation" to "authenticated";

grant trigger on table "public"."evaluation" to "authenticated";

grant truncate on table "public"."evaluation" to "authenticated";

grant update on table "public"."evaluation" to "authenticated";

grant delete on table "public"."evaluation" to "service_role";

grant insert on table "public"."evaluation" to "service_role";

grant references on table "public"."evaluation" to "service_role";

grant select on table "public"."evaluation" to "service_role";

grant trigger on table "public"."evaluation" to "service_role";

grant truncate on table "public"."evaluation" to "service_role";

grant update on table "public"."evaluation" to "service_role";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";

grant delete on table "public"."submission" to "anon";

grant insert on table "public"."submission" to "anon";

grant references on table "public"."submission" to "anon";

grant select on table "public"."submission" to "anon";

grant trigger on table "public"."submission" to "anon";

grant truncate on table "public"."submission" to "anon";

grant update on table "public"."submission" to "anon";

grant delete on table "public"."submission" to "authenticated";

grant insert on table "public"."submission" to "authenticated";

grant references on table "public"."submission" to "authenticated";

grant select on table "public"."submission" to "authenticated";

grant trigger on table "public"."submission" to "authenticated";

grant truncate on table "public"."submission" to "authenticated";

grant update on table "public"."submission" to "authenticated";

grant delete on table "public"."submission" to "service_role";

grant insert on table "public"."submission" to "service_role";

grant references on table "public"."submission" to "service_role";

grant select on table "public"."submission" to "service_role";

grant trigger on table "public"."submission" to "service_role";

grant truncate on table "public"."submission" to "service_role";

grant update on table "public"."submission" to "service_role";

create policy "Enable ALL for authenticated users only"
on "public"."evaluation"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable ALL for authenticated users only"
on "public"."profile"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable ALL for authenticated users only"
on "public"."submission"
as permissive
for all
to authenticated
using (true)
with check (true);
