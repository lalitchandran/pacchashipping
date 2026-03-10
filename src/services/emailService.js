import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendContactEmail = async (formData) => {
    try {
        // 1. Log request to Firebase Firestore
        let docRefId = 'pending';
        try {
            const docRef = await addDoc(collection(db, 'inquiries'), {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                createdAt: serverTimestamp(),
                status: 'new'
            });
            docRefId = docRef.id;
            console.log("Inquiry logged to Firebase with ID: ", docRefId);
        } catch (firebaseError) {
            console.error('Failed to log to Firebase, but proceeding with email. Error:', firebaseError);
        }

        // 2. Send Email to Admin (using existing template logic, or adapt as needed)
        const adminResponse = await emailjs.send(
            serviceId,
            templateId,
            {
                from_name: formData.name,
                from_email: formData.email,
                phone_number: formData.phone,
                message: formData.message,
                reply_to: formData.email,
                to_email: 'lsasudhamani@gmail.com'
            },
            publicKey
        );
        console.log('Admin notification sent!', adminResponse.status);

        // 3. Send Auto-Reply to User
        // Note: For User auto-reply, you may need a dedicated templateId in EmailJS. 
        // Here we send it using the same service/publicKey, but routing back to the user's email.
        // It provides a confirmation response. 
        const userAutoReplyResponse = await emailjs.send(
            serviceId,
            templateId, // Ideally this should be a specific user confirmation template
            {
                from_name: 'Paccha Shipping Team',
                from_email: 'noreply@pacchashipping.com',
                to_name: formData.name,
                to_email: formData.email,
                message: 'Your request has been sent to the admin and team. They will contact you as soon as possible.',
                reply_to: 'lsasudhamani@gmail.com'
            },
            publicKey
        );
        console.log('User auto-reply sent!', userAutoReplyResponse.status);

        return { adminResponse, userAutoReplyResponse, docId: docRefId };
    } catch (error) {
        console.error('Failed to send email. Error:', error);
        throw error;
    }
};
