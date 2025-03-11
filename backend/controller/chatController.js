import Chat from "../model/chatModel.js";
import asyncHandler from 'express-async-handler'
import User from "../model/userModel.js";

async function accessChatFunctin(req, res){
    const {userId} = req.body;
    if(!userId){
        console.log("User Id not sent with params");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat : false,
        $and : [
            {users:{$elemMatch : {$eq : req.user._id}}},
            {users : {$elemMatch : {$eq : userId}}}
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path : "latestMessage.sender",
        select : "name pic email"
    });

    if(isChat.length > 0){
        res.send(isChat[0]);
    } else {
        var chatData =  {
            chatName : "sender",
            isGroupChat : false,
            users : [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id : createdChat.id}).populate("users", "-password");
            res.status(200).send(FullChat)
        } catch (error) {
            res.status(400);
            throw new Error(error.message)
        }
    }

}

const accessChat = asyncHandler(accessChatFunctin);

async function fetchChatsFunction(req, res){
    try {
        Chat.find({users : {$elemMatch : {$eq : req.user._id}}}).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage")
        .sort({updatedAt : -1}).then(async(results) => {
            results = await User.populate(results, {
                path : "latestMessage.sender",
                select : "name pic email"
            })
            res.status(200).send(results);
        })

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

const fetchChats = asyncHandler(fetchChatsFunction);

async function createGroupChatFunction(req, res){
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message : "Please fill all the fields"});
    }
    var users = JSON.parse(req.body.users);
    if(users.length < 2){
        return res.status(400).send("Please select more than 2 users");
    }

    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName : req.body.name,
            isGroupChat : true,
            users : users,
            groupAdmin : req.user,
        });

        const fullGroupChat = await Chat.findOne({_id : groupChat._id}).populate("users", "-password").populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

const createdChat = asyncHandler(createGroupChatFunction);

async function renameGroupFunction(req, res){
    const {chatId, name} = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,{
            chatName : name,
        },{
            new : true,
        }
    ).populate("users", "-password").populate("groupAdmin", "-password");
    if(!updatedChat){
        res.status(400);
        throw new Error("There is no such group Chat");
    } else {
        res.status(200).json(updatedChat)
    }
}

const renameGroup = asyncHandler(renameGroupFunction);

async function addToGroupFunction(req, res){
    const {chatId, userId} = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,{
            $push : {users : userId},
        }, {
            new : true
        }).populate("users", "-password").populate("groupAdmin", "-password");
    
    if(!added){
        res.status(404);
        throw new Error("There is no such group chat");
    } else {
        res.status(200).json(added);
    }

}

const addToGroup = asyncHandler(addToGroupFunction);

async function removeFromGroupFunction(req, res){
    const {chatId, userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(
        chatId,{
            $pull : {users : userId}
        },{
            new : true
        }
    ).populate("users", "-password").populate("groupAdmin", "-password");
    if(!removed){
        res.status(404);
        throw new Error("Chat not found")
    } else {
        res.status(200).json(removed);
    }
}

const removeFromGroup = asyncHandler(removeFromGroupFunction);

export {accessChat, fetchChats, createGroupChatFunction, renameGroup, addToGroup, removeFromGroup};