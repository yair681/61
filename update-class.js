// סקריפט לעדכון פרטי כיתה קיימת
// הרץ את זה פעם אחת כדי לעדכן את הכיתה "ח3"

require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

// הגדרת Schema
const classSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    teacherPassword: { type: String, required: true, unique: true },
    teacherName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Class = mongoose.model('Class', classSchema);

async function updateClass() {
    try {
        // התחברות למסד נתונים
        await mongoose.connect(mongoURI);
        console.log("✅ התחברות למסד נתונים הצליחה");

        // חיפוש הכיתה "ח3"
        const existingClass = await Class.findOne({ name: 'ח3' });
        
        if (!existingClass) {
            console.log("❌ לא נמצאה כיתה בשם 'ח3'");
            
            // אם אין כיתה, ניצור אותה
            const newClass = new Class({
                name: 'ח3',
                teacherName: 'הרב אליהו',
                teacherPassword: 'הרב אליהו 123'
            });
            await newClass.save();
            console.log("✅ כיתה חדשה נוצרה בהצלחה!");
        } else {
            console.log(`📝 נמצאה כיתה: ${existingClass.name}`);
            console.log(`   מורה נוכחי: ${existingClass.teacherName || 'לא הוגדר'}`);
            console.log(`   סיסמה נוכחית: ${existingClass.teacherPassword || 'לא הוגדרה'}`);
            
            // עדכון הפרטים
            existingClass.teacherName = 'הרב אליהו';
            existingClass.teacherPassword = 'הרב אליהו 123';
            await existingClass.save();
            
            console.log("\n✅ הכיתה עודכנה בהצלחה!");
            console.log(`   מורה חדש: ${existingClass.teacherName}`);
            console.log(`   סיסמה חדשה: ${existingClass.teacherPassword}`);
        }

        // הצגת כל הכיתות
        console.log("\n📋 כל הכיתות במערכת:");
        const allClasses = await Class.find({});
        allClasses.forEach(cls => {
            console.log(`\n   כיתה: ${cls.name}`);
            console.log(`   מורה: ${cls.teacherName}`);
            console.log(`   סיסמה: ${cls.teacherPassword}`);
        });

    } catch (error) {
        console.error("❌ שגיאה:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("\n✅ הסקריפט הסתיים");
        process.exit(0);
    }
}

updateClass();
