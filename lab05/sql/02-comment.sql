create table comment
(
    id integer not null
    primary key autoincrement,
    author text not null,
    content text not null
);