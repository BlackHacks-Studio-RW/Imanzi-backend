import bcrypt from 'bcryptjs'

const users = [
  {
    first_name: 'John',
    last_name: 'Doe',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
  },
  {
    first_name: 'John',
    last_name: 'Doe',
    email: 'admin2@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
  },
  {
    first_name: 'John',
    last_name: 'Doe',
    email: 'seller@example.com',
    password: bcrypt.hashSync('123456', 10),
    role:'seller'
  },
  {
    first_name: 'John',
    last_name: 'Doe',
    email: 'seller2@example.com',
    password: bcrypt.hashSync('123456', 10),
    role:'seller'
  },
  {
   first_name: 'John',
    last_name: 'Doe',
    email: 'buyer@example.com',
    password: bcrypt.hashSync('123456', 10),
    role:'buyer'
  },
  {
    first_name: 'John',
    last_name: 'Doe',
    email: 'buyer2@example.com',
    password: bcrypt.hashSync('123456', 10),
    role:'buyer'
  },
]

export default users