
import models from '../database/models';
import {comparePassword, hashPassword,jwtToken } from '../utils/jwToken';

const { User } = models;
export default class Users {
  
  static async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user_ = await User.findOne({ where: { email } });
      if (!user_) return res.status(400).send({ status: 400, error: "User doesn't exist" });
      if (user_ && comparePassword(password, user_.password)) {
        const token = jwtToken.createToken(user_);
        return res.status(200).send({ token });
      }
      return res.status(400).send({ status: 400, error: 'invalid email/password combination ' });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  static async signup(req,res){
    try{
    const {firstName,
      lastName,
      phone,
      email,
      password
    }=req.body;
    // const{email}=req.body.email
    const existUser=await User.findOne({where:{email:req.body.email}})
    if(existUser){
      return res.status(409).json({
        message:'user already exists'
      });
    }
    const hashedPassword=hashPassword(password)
    const newUser = await User.create({
    firstName,
    phone,
		lastName,
		email,
		role,
		password: hashedPassword,
  }).then((data=>{
    const token = jwtToken.createToken(data);
    return res.status(201).send({
		token,
		unewUser: {
			firstName,
			lastName,
			email,
		},
		message: 'User is registered',
	});
  }))
 
  
  }catch(error){
    // return res.status(500).send(console.log(error))
    console.log(error)
  }
}
}