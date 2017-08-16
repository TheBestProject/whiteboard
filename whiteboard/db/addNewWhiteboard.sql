insert into whiteboards(name, project_id, image_data)
values ($1, $2, $3)
returning *;