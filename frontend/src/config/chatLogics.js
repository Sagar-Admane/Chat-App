export const getSender1 = (loggedUser, users) => {
    if (!users || users.length < 2 || !loggedUser) return "Unknown User";

    return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
    
};


export const getSender = (loggedUser, users) => {
    if (!users || users.length < 2 || !loggedUser) return { name: "Unknown User", pic: "" };

    return users[0]?._id === loggedUser?._id 
        ? { name: users[1]?.name, pic: users[1]?.pic, email : users[1]?.email } 
        : { name: users[0]?.name, pic: users[0]?.pic, email : users[2]?.email };
};


export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 37;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };
  
  export const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };
  
  export const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };
  
  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };