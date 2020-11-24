CREATE TYPE user_upload_type AS ENUM ('PROFILE_IMAGE');

CREATE TABLE user_upload (
    id BIGINT NOT NULL GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES app_user (id) ON DELETE NO ACTION ON UPDATE CASCADE,
    upload_type user_upload_type NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_user_upload_updated_at_column
BEFORE UPDATE ON user_upload
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
