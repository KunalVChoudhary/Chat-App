import {Schema, model} from 'mongoose';

const messageSchema = new Schema(
    {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        image: { type: String },
        seen: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Message = model('Message', messageSchema);
export default Message;