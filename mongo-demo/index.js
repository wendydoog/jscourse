const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then (() => console.log('Connected to MongoDB...'))
.catch( err => console.log('Could not connect the Mongodb',err))

const courseSchema = new mongoose.Schema({
    name: {type: String,
         required: true,
         minlength: 5,
         maxlength: 255
    },
    category: {
        type: String,
        enum: ['web','mobile', 'network'],
        required: true,
        lowercase: true
    },
    author: String,
    tags: {
        type: Array,
        validate:{
            isAsync: true,
            validator: function(v, callback) {
                //do some async work
                setTimeout(() =>{
                   const result = v && v.length > 0;
                   callback(result);
                },4000);
            },
            message: 'A course should have at least one tag.'
        }
    },
    date: {type: Date, default: Date.now},
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() {return this.isPublished;},
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});

const Course = mongoose.model('Course', courseSchema);


async function createCourse(){
    const course = new Course({
        name: 'Angular Course',
        category: 'Web',
        author: 'Mosh',
        tags : null,
        isPublished: true
    })
    try{
        const result = await course.save();
        console.log(result);
    }
    catch(ex){
        for (field in ex.errors)
        console.log(ex.errors[field].message)
    }
}

createCourse()



async function getCourses(){
    //***Comparison Operators***
    //eq: equal
    //ne: not equal
    //gt: greater than
    //.find({price: {$gt: 10, $lte:20}})
    //gte
    //lt, lte
    //in 
    //nin
    //.find({price: {$in: [10,15,20]}})

    //***Logical Query Operators***
    //or
    //and
    //.find().or({author:'Mosh'},{isPublished:true})
    //.find().and({author:'Mosh'},{isPublished:true})

    //***Regular Expressions***
    //Starts with Mosh
    //.find({ author: /^Mosh/})
    //Ends with Hamedani
    //.find({author: /Hamedani$/i}) i:case insensitive
    //Contains Mosh
    //.find({author: /.*Mosh.*/i })

    const pageNumber = 2;
    const pageSize = 10;
    // /api/courses?pageNumber=2&pageSize=10



    const courses = await Course
        .find({author:'Mosh', isPublished: true})
        .skip((pageNumber-1)*pageSize)
        .limit(pageSize)
        .sort({name: 1})
        .select({name: 1, tags: 1});
        //.count();  //Counting
        //
    console.log(courses);
}

//getCourses();

async function updateCourse(id){
    // Approach: Query first 
    //findById()
    //Modify its properties
    //save()

    const course = await Course.findById(id);
    if (!course) return;
    course.isPublished = true;
    course.author = 'Another author'

    const result = await course.save();
    console.log(result);
}

async function updateCourse2(id){
    //
    const course = await Course.findByIdAndUpdate({_id: id}, {
        $set:{
            author: 'Mosh',
            isPublished: false
        }
    }, {new: true});
    console.log(course)

}

//updateCourse2("607a93e19c2b431b1669f02a")

async function removeCourse(id){
    const course = await Course.findByIdAndRemove({_id: id});
    console.log(course)

}

//removeCourse("607a93e19c2b431b1669f02a")