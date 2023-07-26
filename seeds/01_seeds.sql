-- INSERT INTO users( 
--   name, 
--   email, 
--   password 
-- ) VALUES ('Ola','ola@ola.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
-- ('jolu','jolu@olu.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
-- ('woola','wooola@ola.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- INSERT INTO properties(owner_id,
--   title,
--   description,
--   thumbnail_photo_url,
--   cover_photo_url,
--   cost_per_night,
--   parking_spaces,
--   number_of_bathrooms, 
--   number_of_bedrooms, 
--   country,
--   street,
--   city,
--   province,
--   post_code,
--   active) VALUES (1,'bungalow','description','www.example.com','example2.com',500,2,2,4,'canada','kayak','ottawa','ontario','k2j 6p2',true),
--   (3,'base2','description','www.example.com','example2.com',500,2,2,4,'canada','kayak','ottawa','ontario','k2j 6p2',true),
--   (2,'base3','description','www.example.com','example2.com',500,2,2,4,'canada','kayak','ottawa','ontario','k2j 6p2',true);

-- INSERT INTO reservations (start_date, end_date, property_id, guest_id)
-- VALUES ('2018-09-11', '2018-09-26', 1, 1),
-- ('2019-01-04', '2019-02-01', 2, 2),
-- ('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (
  guest_id,
  property_id,
  reservation_id,
  rating,
  message) VALUES ( 1 ,1,13,1,'message'),( 2 ,2,14,2,'message'),( 3 ,3,15,3,'message');

