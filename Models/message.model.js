import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
      validate: [
        {
          validator: (value) => value.length > 0,
          message: 'Message cannot be empty',
        },
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
