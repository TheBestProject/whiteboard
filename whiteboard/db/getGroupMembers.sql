select users.id, users.name as username, users.profilepic from group_members 
join groups on groups.id = group_members.group_id
join users on users.id = group_members.user_id
where groups.id = $1
