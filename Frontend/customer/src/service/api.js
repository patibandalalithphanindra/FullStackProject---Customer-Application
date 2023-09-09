import axios  from 'axios';

const userUrl='http://localhost:8080';

// export const loginUser= async(user)=>{
        
//     return await 
     
// }

class UserService {
    

    getCustomers(){
        return axios.get(userUrl+'/customers');
    }
    
    // addProduct(product){
    //     return axios.post(userUrl +'/admin/addProduct' , product);
    // }
    // getUid(){
    //     return axios.get(userUrl+'/home');
    // }

}

export default new UserService();