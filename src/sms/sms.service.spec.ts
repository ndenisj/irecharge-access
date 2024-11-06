import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SmsService } from './sms.service';
import { TwilioMockProvider } from './providers/twilio-mock.provider';
import { MessageBirdMockProvider } from './providers/messagebird-mock.provider';

describe('SmsService', () => {
  // Declare variables for service and dependencies
  let service: SmsService;
  let configService: ConfigService;
  let twilioProvider: TwilioMockProvider;
  let messageBirdProvider: MessageBirdMockProvider;

  // Create a mock function for the sendSms method that we'll use throughout our tests
  const mockSendSms = jest.fn();

  beforeEach(async () => {
    // Reset the mock before each test to ensure clean state
    mockSendSms.mockReset();

    // Create a testing module with mock providers
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        // Mock ConfigService to return default values
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key, defaultValue) => defaultValue),
          },
        },
        // Mock Twilio provider with our mock sendSms function
        {
          provide: TwilioMockProvider,
          useValue: {
            sendSms: mockSendSms,
          },
        },
        // Mock MessageBird provider
        {
          provide: MessageBirdMockProvider,
          useValue: {
            sendSms: jest.fn(),
          },
        },
      ],
    }).compile();

    // Get instances of service and providers from the testing module
    service = module.get<SmsService>(SmsService);
    configService = module.get<ConfigService>(ConfigService);
    twilioProvider = module.get<TwilioMockProvider>(TwilioMockProvider);
    messageBirdProvider = module.get<MessageBirdMockProvider>(MessageBirdMockProvider);
  });

  // Basic test to ensure service is properly initialized
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test suite for provider selection functionality
  describe('setProvider', () => {
    // Test successful Twilio provider selection
    it('should set Twilio provider', () => {
      service.setProvider('twilio');
      expect(service.getCurrentProvider()).toBe(twilioProvider);
    });

    // Test successful MessageBird provider selection
    it('should set MessageBird provider', () => {
      service.setProvider('messagebird');
      expect(service.getCurrentProvider()).toBe(messageBirdProvider);
    });

    // Test error handling for empty provider name
    it('should throw error for empty provider name', () => {
      expect(() => service.setProvider('')).toThrow('Provider name cannot be empty');
    });

    // Test error handling for invalid provider name
    it('should throw error for unsupported provider', () => {
      expect(() => service.setProvider('invalid')).toThrow('Unsupported SMS provider: invalid');
    });
  });

  // Test suite for SMS sending functionality
  describe('sendSms', () => {
    // Test data
    const phoneNumber = '+1234567890';
    const message = 'Test message';

    // Test successful SMS sending on first attempt
    it('should successfully send SMS on first attempt', async () => {
      // Configure mock to resolve successfully
      mockSendSms.mockImplementation(() => Promise.resolve());

      await service.sendSms(phoneNumber, message);
      // Verify that sendSms was called with correct parameters
      expect(mockSendSms).toHaveBeenCalledWith(phoneNumber, message);
    });

    // Test retry mechanism when first attempt fails
    it('should retry on failure and succeed', async () => {
      // Configure mock to fail first time and succeed second time
      mockSendSms
        .mockImplementationOnce(() => Promise.reject(new Error('First attempt failed')))
        .mockImplementationOnce(() => Promise.resolve());

      await service.sendSms(phoneNumber, message);
      // Verify that sendSms was called twice (initial + one retry)
      expect(mockSendSms).toHaveBeenCalledTimes(2);
    });

    // Test maximum retry attempts exceeded
    it('should throw error after max retry attempts', async () => {
      // Configure mock to always fail
      mockSendSms.mockImplementation(() => Promise.reject(new Error('Failed')));

      // Verify that error is thrown after max retries
      await expect(service.sendSms(phoneNumber, message)).rejects.toThrow(
        'Failed to send SMS after 3 attempts'
      );
      // Verify that sendSms was called exactly 3 times (max retries)
      expect(mockSendSms).toHaveBeenCalledTimes(3);
    });

    // Test input validation for phone number
    it('should throw error for empty phone number', async () => {
      await expect(service.sendSms('', message)).rejects.toThrow('Phone number and message are required');
    });

    // Test input validation for message
    it('should throw error for empty message', async () => {
      await expect(service.sendSms(phoneNumber, '')).rejects.toThrow('Phone number and message are required');
    });
  });
});