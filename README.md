# Electricity Bill Payment System

## Overview

This is an event-driven backend service for electricity bill vending and payments built with NestJS, TypeORM, and PostgreSQL. The system uses a mock SMS for notifications.

## Features

- Electricity bill verification and creation
- Bill payment processing
- Wallet management
- Event-driven architecture (Event Emitter)
- SMS notifications (mocked)
- Provider integrations (mocked)

## Tech Stack

- NestJS (Backend Framework)
- TypeORM (ORM)
- PostgreSQL (Database)
- Docker & Docker Compose

## Setup Instructions

1. Clone the repository:

```bash
git clone git@github.com:ndenisj/irecharge-access.git
```

2. Install dependencies:

```bash
npm install
```

## Compile and run the project

1. Run with Docker:

```bash
docker-compose up -d
```

2. Access the API at:

```bash
http://localhost:3000/v1/api/
```

3. Run Test

```bash
npm run test
```

## API Endpoints

```bash
POST /electricity/verify
    Create a new electricity bill
    Request body: { amount: number, meterId: string }

POST /vend/{validationRef}/pay
    Process bill payment
    Path parameter: validationRef
    Request body: { walletId: string }

POST /wallets/{id}/add-funds
    Add funds to wallet
    Path parameter: id
    Request body: { amount: number }
```

## Event System

```bash
bill_created: Triggered when a new bill is created

payment_completed: Triggered when payment is successful

wallet_updated: Triggered when wallet balance changes

```
