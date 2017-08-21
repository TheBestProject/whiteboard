insert into users(auth0_id, name, email, profilepic)
values ($1, $2, $3, $4)
returning *;