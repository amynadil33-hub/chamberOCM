-- 0001_extensions_and_enums.sql
-- MCCI Digital Platform — extensions and enumerated types.

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

do $$ begin
  create type app_role as enum ('member', 'editor', 'admin', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_status as enum ('draft', 'scheduled', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum (
    'draft', 'submitted', 'under_review', 'more_information_required',
    'approved', 'rejected', 'withdrawn'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type membership_status as enum ('pending', 'active', 'suspended', 'expired', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type document_status as enum ('uploaded', 'under_review', 'verified', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type invoice_status as enum ('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending', 'verified', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type registration_status as enum ('pending', 'confirmed', 'waitlisted', 'cancelled', 'attended', 'no_show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type account_status as enum ('active', 'inactive', 'suspended');
exception when duplicate_object then null; end $$;
