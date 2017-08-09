update projects
set name = $1
where id = $2
returning *;