update whiteboards
set thumbnail = $1
where id = $2
returning *;