import { ClientProfile } from 'src/client-profile/entities/client-profile.entity';
import { FreelancerProfile } from 'src/freelancer-profile/entities/freelancer-profile.entity';
import { Mission } from 'src/mission/entities/mission.entity';
import { User, UserRole } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' }); // Adjust path if needed
async function seedDatabase() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'freelance_db',
    entities: [User, ClientProfile, FreelancerProfile, Mission],
    synchronize: true,
    logging: true,
  });

  await dataSource.initialize();

  // Repositories
  const userRepo = dataSource.getRepository(User);
  const clientProfileRepo = dataSource.getRepository(ClientProfile);
  const freelancerProfileRepo = dataSource.getRepository(FreelancerProfile);
  const missionRepo = dataSource.getRepository(Mission);

  // Create client
  const client = await userRepo.save({
    username: 'client_john',
    email: 'john@client.com',
    password: '$2a$10$examplehash', // In real app, use proper hashing
    isAdmin: false,
    currentRole: UserRole.CLIENT
  });

  await clientProfileRepo.save({
    user: client,
    companyName: 'Tech Solutions Inc.',
    industry: 'IT Services'
  });

  // Create freelancers
  const freelancer1 = await userRepo.save({
    username: 'freelancer_sarah',
    email: 'sarah@freelancer.com',
    password: '$2a$10$examplehash',
    isAdmin: false,
    currentRole: UserRole.FREELANCER
  });

  const freelancerProfile1 = await freelancerProfileRepo.save({
    user: freelancer1,
    skills: ['JavaScript', 'React', 'Node.js'],
    hourlyRate: 45,
    bio: 'Full-stack developer with 4 years experience'
  });

  const freelancer2 = await userRepo.save({
    username: 'freelancer_mike',
    email: 'mike@freelancer.com',
    password: '$2a$10$examplehash',
    isAdmin: false,
    currentRole: UserRole.FREELANCER
  });

  const freelancerProfile2 = await freelancerProfileRepo.save({
    user: freelancer2,
    skills: ['Python', 'Django', 'Data Analysis'],
    hourlyRate: 60,
    bio: 'Backend specialist with machine learning skills'
  });

  // Create missions
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  // Mission 1 - No preselected freelancers
  await missionRepo.save({
    title: 'Website Redesign',
    description: 'Modern redesign of company homepage',
    status: 'not_assigned',
    price: 2500,
    date: today.toISOString().split('T')[0],
    client: client,
    requiredSkills: ['HTML', 'CSS', 'JavaScript'],
    deadline: nextWeek,
    budget: '2000-3000',
    clientName: 'John Client',
    progress: 0,
    tasks: { total: 5, completed: 0 }
  });

  // Mission 2 - With preselected freelancers
  const missionWithFreelancers = await missionRepo.save({
    title: 'E-commerce Platform',
    description: 'Build online store with payment integration',
    status: 'not_assigned',
    price: 5000,
    date: today.toISOString().split('T')[0],
    client: client,
    requiredSkills: ['React', 'Node.js', 'MongoDB'],
    deadline: nextWeek,
    budget: '4500-5500',
    clientName: 'John Client',
    progress: 0,
    tasks: { total: 8, completed: 0 },
    preselectedFreelancers: [freelancerProfile1, freelancerProfile2]
  });

  // Mission 3 - Another simple mission
  await missionRepo.save({
    title: 'Mobile App UI',
    description: 'Design UI for fitness tracking app',
    status: 'not_assigned',
    price: 1800,
    date: today.toISOString().split('T')[0],
    client: client,
    requiredSkills: ['Figma', 'UI/UX'],
    deadline: nextWeek,
    budget: '1500-2000',
    clientName: 'John Client',
    progress: 0,
    tasks: { total: 4, completed: 0 }
  });

  console.log('Database seeded successfully!');
  await dataSource.destroy();
}

seedDatabase().catch(err => console.error('Seeding error:', err));