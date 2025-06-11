#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful!');
    console.log('⏰ Current time:', result[0].current_time);
    
    // Test basic operations
    console.log('\n📊 Testing basic operations...');
    
    const userCount = await prisma.user.count();
    const questionCount = await prisma.question.count();
    const answerCount = await prisma.answer.count();
    const rewardCount = await prisma.reward.count();
    
    console.log(`👥 Users: ${userCount}`);
    console.log(`❓ Questions: ${questionCount}`);
    console.log(`📝 Answers: ${answerCount}`);
    console.log(`🏆 Rewards: ${rewardCount}`);
    
    console.log('\n✅ All tests passed! Database is working correctly.');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
