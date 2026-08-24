# Database Schema

The production PostgreSQL DDL is in `database/schema.sql`. Merchants own printer configurations and pricing rules; customers may be guest records with no raw contact data; jobs store immutable quoted totals and requested specifications; transactions store processor references. Add row-level authorization, encrypted document references, audit records, indexes, retention jobs, and migrations before deployment. No seeder is included.
