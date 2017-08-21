insert into groups(name)
values ($1)
returning *;