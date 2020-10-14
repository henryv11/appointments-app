import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export function up(pgm: MigrationBuilder) {
  pgm.sql(`CREATE TABLE person (
        id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        date_of_birth DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )`);

  pgm.sql(
    `CREATE TABLE app_user (
            id BIGINT NOT NULL GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            person_id BIGINT NOT NULL REFERENCES person (id),
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )`,
  );

  pgm.sql(`CREATE TYPE person_agreement_type AS ENUM ('TERMS_AND_CONDITIONS')`);

  pgm.sql(`CREATE TABLE person_agreements (
        agreement_type person_agreement_type NOT NULL,
        person_id BIGINT NOT NULL REFERENCES person (id),
        hasAccepted BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        PRIMARY KEY (agreement_type, person_id)
    )`);

  pgm.sql(
    `CREATE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = now();
                RETURN NEW;   
            END;
            $$ LANGUAGE plpgsql`,
  );

  pgm.sql(
    `CREATE TRIGGER update_app_user_updated_at_column BEFORE UPDATE on app_user FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column()`,
  );

  pgm.sql(
    `CREATE TRIGGER update_person_agreements_updated_at_column BEFORE UPDATE on person_agreements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column()`,
  );

  pgm.sql(
    `CREATE TRIGGER update_person_updated_at_column BEFORE UPDATE on person FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column()`,
  );
}

export function down(pgm: MigrationBuilder) {
  pgm.sql('DROP FUNCTION update_updated_at_column CASCADE');
  pgm.sql('DROP TABLE app_user CASCADE');
  pgm.sql('DROP TABLE person CASCADE');
  pgm.sql('DROP TABLE person_agreements CASCADE');
  pgm.sql('DROP TYPE person_agreement_type CASCADE');
}
