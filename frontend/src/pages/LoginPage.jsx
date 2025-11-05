import { useState, useContext } from 'react';import { useState, useContext } from 'react';

import { AuthContext } from '../context/AuthContext';import { AuthContext } from '../context/AuthContext';



const LoginPage = () => {const LoginPage = () => {

    const { login, register } = useContext(AuthContext);    const { login, register } = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(true);    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({    const [formData, setFormData] = useState({

        email: '',        email: '',

        password: '',        password: '',

        role: 'student',        role: 'student',

        name: '',        name: '',

        department: '',        department: '',

        contact: '',        contact: '',

        enrollment_no: '',        enrollment_no: '',

    });    });

    const [isLoading, setIsLoading] = useState(false);    const [isLoading, setIsLoading] = useState(false);



    const handleChange = (e) => {    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value });        setFormData({ ...formData, [e.target.name]: e.target.value });

    };    };



    const handleSubmit = async (e) => {    const handleSubmit = async (e) => {

        e.preventDefault();        e.preventDefault();

        setIsLoading(true);        setIsLoading(true);



        if (isLogin) {        if (isLogin) {

            await login({            await login({

                email: formData.email,                email: formData.email,

                password: formData.password,                password: formData.password,

                role: formData.role,                role: formData.role,

            });            });

        } else {        } else {

            await register(formData);            await register(formData);

        }        }



        setIsLoading(false);        setIsLoading(false);

    };    };



    const demoCredentials = {    return (

        student: { email: 'rahul.sharma@college.edu', password: 'Student@123' },        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">

        faculty: { email: 'rajesh.kumar@college.edu', password: 'Faculty@123' },            <div className="max-w-md w-full">

        admin: { email: 'admin@college.edu', password: 'Admin@123' },                {/* Header */}

    };                <div className="text-center mb-8">

                    <h1 className="text-4xl font-bold text-gray-900 mb-2">SGMS</h1>

    const fillDemo = (role) => {                    <p className="text-gray-600">Student Grievance Management System</p>

        setFormData({                </div>

            ...formData,

            email: demoCredentials[role].email,                {/* Form Card */}

            password: demoCredentials[role].password,                <div className="bg-white rounded-2xl shadow-xl p-8">

            role: role,                    <h2 className="text-2xl font-bold text-gray-900 mb-6">

        });                        {isLogin ? 'Sign In' : 'Create Account'}

    };                    </h2>



    return (                    <form onSubmit={handleSubmit} className="space-y-4">

        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">                        {!isLogin && (

            {/* Animated Background */}                            <>

            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"></div>                                <div>

                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>

            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 relative z-10">                                    <input

                {/* Left Side - Info Panel */}                                        type="text"

                <div className="hidden md:flex flex-col justify-center text-white space-y-6 p-8 fade-in">                                        name="name"

                    <div className="space-y-4">                                        value={formData.name}

                        <h1 className="text-5xl font-extrabold leading-tight">                                        onChange={handleChange}

                            Student Grievance                                        className="input-field"

                            <span className="block text-yellow-300">Management System</span>                                        required

                        </h1>                                    />

                        <p className="text-xl text-blue-100">                                </div>

                            A modern platform to submit, track, and resolve student grievances efficiently.

                        </p>                                <div>

                    </div>                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>

                                    <input

                    <div className="space-y-4">                                        type="text"

                        <div className="flex items-center space-x-3">                                        name="enrollment_no"

                            <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">                                        value={formData.enrollment_no}

                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">                                        onChange={handleChange}

                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />                                        className="input-field"

                                </svg>                                        required

                            </div>                                    />

                            <p className="text-lg">Easy Grievance Submission</p>                                </div>

                        </div>

                        <div className="flex items-center space-x-3">                                <div>

                            <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>

                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">                                    <input

                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />                                        type="text"

                                </svg>                                        name="department"

                            </div>                                        value={formData.department}

                            <p className="text-lg">Real-time Status Tracking</p>                                        onChange={handleChange}

                        </div>                                        className="input-field"

                        <div className="flex items-center space-x-3">                                    />

                            <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">                                </div>

                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">

                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />                                <div>

                                </svg>                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>

                            </div>                                    <input

                            <p className="text-lg">Secure & Confidential</p>                                        type="tel"

                        </div>                                        name="contact"

                    </div>                                        value={formData.contact}

                </div>                                        onChange={handleChange}

                                        className="input-field"

                {/* Right Side - Login Form */}                                    />

                <div className="glass-effect rounded-3xl shadow-2xl p-8 md:p-12 slide-in">                                </div>

                    {/* Mobile Logo */}                            </>

                    <div className="md:hidden text-center mb-6">                        )}

                        <h1 className="text-3xl font-bold gradient-text">SGMS</h1>

                    </div>                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">                            <input

                        {isLogin ? 'Welcome Back' : 'Create Account'}                                type="email"

                    </h2>                                name="email"

                    <p className="text-gray-600 mb-8">                                value={formData.email}

                        {isLogin ? 'Sign in to continue to your account' : 'Register to get started'}                                onChange={handleChange}

                    </p>                                className="input-field"

                                required

                    {/* Demo Credentials Quick Access */}                            />

                    {isLogin && (                        </div>

                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">

                            <p className="text-sm font-semibold text-blue-800 mb-2">🚀 Quick Demo Login:</p>                        <div>

                            <div className="flex flex-wrap gap-2">                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>

                                <button                            <input

                                    type="button"                                type="password"

                                    onClick={() => fillDemo('student')}                                name="password"

                                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"                                value={formData.password}

                                >                                onChange={handleChange}

                                    Student                                className="input-field"

                                </button>                                required

                                <button                                minLength={6}

                                    type="button"                            />

                                    onClick={() => fillDemo('faculty')}                        </div>

                                    className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-all transform hover:scale-105"

                                >                        <div>

                                    Faculty                            <label className="block text-sm font-medium text-gray-700 mb-1">Login As</label>

                                </button>                            <select

                                <button                                name="role"

                                    type="button"                                value={formData.role}

                                    onClick={() => fillDemo('admin')}                                onChange={handleChange}

                                    className="px-3 py-1 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 transition-all transform hover:scale-105"                                className="input-field"

                                >                                required

                                    Admin                            >

                                </button>                                <option value="student">Student</option>

                            </div>                                <option value="faculty">Faculty</option>

                        </div>                                <option value="admin">Admin</option>

                    )}                            </select>

                        </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Role Selection */}                        <button

                        <div>                            type="submit"

                            <label className="block text-sm font-semibold text-gray-700 mb-2">Login As</label>                            disabled={isLoading}

                            <div className="grid grid-cols-3 gap-2">                            className="w-full btn btn-primary py-3 text-lg"

                                {['student', 'faculty', 'admin'].map((role) => (                        >

                                    <button                            {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}

                                        key={role}                        </button>

                                        type="button"                    </form>

                                        onClick={() => setFormData({ ...formData, role })}

                                        className={`px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 ${                    <div className="mt-6 text-center">

                                            formData.role === role                        <button

                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'                            onClick={() => setIsLogin(!isLogin)}

                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'                            className="text-blue-600 hover:text-blue-700 font-medium"

                                        }`}                        >

                                    >                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}

                                        {role.charAt(0).toUpperCase() + role.slice(1)}                        </button>

                                    </button>                    </div>

                                ))}

                            </div>                    {/* Demo Credentials */}

                        </div>                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">

                        <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>

                        {!isLogin && (                        <div className="text-xs text-gray-600 space-y-1">

                            <>                            <p><strong>Student:</strong> rahul.sharma@college.edu / Student@123</p>

                                <div>                            <p><strong>Faculty:</strong> rajesh.kumar@college.edu / Faculty@123</p>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>                            <p><strong>Admin:</strong> admin@college.edu / Admin@123</p>

                                    <input                        </div>

                                        type="text"                    </div>

                                        name="name"                </div>

                                        value={formData.name}            </div>

                                        onChange={handleChange}        </div>

                                        className="input-field"    );

                                        placeholder="Enter your full name"};

                                        required

                                    />export default LoginPage;

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Enrollment No.
                                        </label>
                                        <input
                                            type="text"
                                            name="enrollment_no"
                                            value={formData.enrollment_no}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="e.g., CS2021001"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="e.g., Computer Science"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn btn-primary text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : isLogin ? (
                                'Sign In'
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                        </button>
                    </div>

                    {/* Footer Note */}
                    <p className="mt-6 text-xs text-center text-gray-500">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
