insert into whiteboards(name, project_id)
values ($1, $2)
returning *;