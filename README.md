# StevensMarketPlace_CS_546_Group16_FinalProject
hello github, and all group members  
hope we will success to finish the project

# **work schema**:
data->routes->web pages ++

# **data collections's functions(3-days)**:  
- **user**: (Yufu Liao)
  - create(username,password,nickname,gender,address); 
    - return user_id/"create fail"
  - login(username,password); 
    - return "login success"/"username not correct"/"password not correct"
  - updatePassword(user_id,oldPassword,newPassword);
    - return "success"/"not correct"
  - forgetPassword(user_id);
    - return "success"
  - updateInfo(user_id,nickname,gender,address)
    - return newuser
  - findOne(user_id)
    - return user
  - cart(user_id,item_id)
    - return user
- **item**: (yash)
  - create(seller_id,title,price,photos,description);
    - return item
  - update(item_id,title,price,photos,description);
    - return newItem
  - delete(item_id)
    - return "delete success"
  - findAll()
    - return allItem
  - findOne(item_id)
    - return item
  - search("words")
    - return matchedItem
- **comment**: (aditya)
  - create(item_id,date,comment)
    - return comment
  - getAll(item_id)
    - return allComment
- **transaction**: (venkat)
  - create(item_id,buyer_id,date,type,value)
    - return transaction
- **messages**: (balakishore)
  - send(message_id,sender_id,date,message)
    - return "success"/"fail"
  - getAll(message_id)
    - return allMessages.