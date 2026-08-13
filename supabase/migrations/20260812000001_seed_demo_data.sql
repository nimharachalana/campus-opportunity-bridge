-- Seed Data for Hackathon Demo

INSERT INTO public.opportunities (title, description, department, type, required_skills, status)
VALUES 
    (
        'AI/ML Research Assistant', 
        'Assist Professor Davis in training LLMs for campus automated advising. Requires strong Python and PyTorch experience.', 
        'Computer Science', 
        'Research', 
        ARRAY['Python', 'PyTorch', 'Machine Learning'], 
        'open'
    ),
    (
        'CS101 Teaching Assistant', 
        'Conduct weekly lab sessions, grade homework assignments, and hold office hours for introductory computer science students.', 
        'Computer Science', 
        'TA', 
        ARRAY['Java', 'Communication', 'Debugging'], 
        'open'
    ),
    (
        'Full Stack Web Development Intern', 
        'Build and maintain internal campus web portals using Next.js, Tailwind CSS, and Supabase.', 
        'Information Technology', 
        'Internship', 
        ARRAY['React', 'Next.js', 'Tailwind', 'TypeScript'], 
        'open'
    ),
    (
        'Robotics Hardware Lab Tech', 
        'Maintain microcontrollers, 3D printers, and sensor arrays in the Mechatronics Research Lab.', 
        'Mechanical Engineering', 
        'Lab Assistant', 
        ARRAY['C++', 'Arduino', 'Electronics'], 
        'open'
    );

-- Additional free courses for guests
INSERT INTO public.opportunities (title, description, department, type, required_skills, status)
VALUES
    (
        'General IOT',
        'Hands-on General IOT course covering sensors, microcontrollers, and connectivity. Free for students.',
        'Community Education',
        'Project',
        ARRAY['Microcontrollers', 'Sensors', 'Networking'],
        'open'
    ),
    (
        'Web Development',
        'Introductory Web Development course covering HTML, CSS, JavaScript and building simple web apps. Free for students.',
        'Community Education',
        'Project',
        ARRAY['HTML', 'CSS', 'JavaScript'],
        'open'
    ),
    (
        'English',
        'English conversation and writing course to improve communication skills. Free and open to all students.',
        'Languages',
        'Project',
        ARRAY['Communication', 'Listening', 'Writing'],
        'open'
    );

-- Additional free courses (Photoshop, Skill Development)
INSERT INTO public.opportunities (title, description, department, type, required_skills, status)
VALUES
    (
        'Photoshop',
        'Basic Photoshop course covering image editing, layers, and compositing. Free for students.',
        'Design',
        'Project',
        ARRAY['Image Editing', 'Layers', 'Composition'],
        'open'
    ),
    (
        'Skill Development',
        'Workshops on soft skills, productivity, and career readiness. Free for students.',
        'Career Services',
        'Project',
        ARRAY['Communication', 'Time Management', 'Networking'],
        'open'
    );

-- Add Video Editing course
INSERT INTO public.opportunities (title, description, department, type, required_skills, status)
VALUES
    (
        'Video Editing',
        'Hands-on Video Editing course covering cutting, color grading, and export best practices. Free for students.',
        'Media',
        'Project',
        ARRAY['Storytelling', 'Editing', 'Color Grading'],
        'open'
    );
