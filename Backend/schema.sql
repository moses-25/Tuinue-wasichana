-- Create ENUM types
CREATE TYPE role_enum AS ENUM ('donor', 'charity', 'admin');
CREATE TYPE application_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE donation_frequency_enum AS ENUM ('one-time', 'monthly');
CREATE TYPE donation_status_enum AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE payment_method_enum AS ENUM ('mpesa', 'paypal');
CREATE TYPE payment_status_enum AS ENUM ('success', 'failed');

-- Table: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role role_enum NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: charities
CREATE TABLE charities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: charity_applications
CREATE TABLE charity_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    mission TEXT NOT NULL,
    status application_status_enum DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

-- Table: donations
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    charity_id INTEGER NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    frequency donation_frequency_enum DEFAULT 'one-time',
    status donation_status_enum DEFAULT 'pending',
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    donation_id INTEGER NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    method payment_method_enum NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    status payment_status_enum NOT NULL,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: stories
CREATE TABLE stories (
    id SERIAL PRIMARY KEY,
    charity_id INTEGER NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: beneficiaries
CREATE TABLE beneficiaries (
    id SERIAL PRIMARY KEY,
    charity_id INTEGER NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    school VARCHAR(255),
    received_support BOOLEAN DEFAULT FALSE,
    received_at TIMESTAMP
);

-- Table: inventory
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    charity_id INTEGER NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    distributed_at TIMESTAMP,
    beneficiary_id INTEGER REFERENCES beneficiaries(id) ON DELETE SET NULL
);
