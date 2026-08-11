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
