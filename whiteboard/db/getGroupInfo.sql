select 
id as ID,
name from groups
where id = $1



-- select distinct
-- users.name,
-- groups.id
-- from users
-- join group_members on users.id = group_members.user_id
-- join groups on groups.id = group_members.group_id
-- order by groups.id