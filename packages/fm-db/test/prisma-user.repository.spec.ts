import { ConflictException } from '@nestjs/common';
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Prisma, User } from '@prisma/client';
import { UserMapper, PrismaUserRepository } from '../src/modules/prisma/repositories/prisma-user.repository';
import { User as UserEntity } from '@repo/fm-domain';

// Vytvárame mock pre PrismaBaseRepository
jest.mock('../src/modules/prisma/repositories/prisma-base.repository', () => {
  return {
    PrismaBaseRepository: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      findById: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  };
});

describe('PrismaUserRepository (Unit)', () => {
  let repository: PrismaUserRepository;
  let mockTransactionHost: any;
  let mockUserMapper: any;
  let mockBaseRepository: any;

  beforeEach(() => {
    // Mock pre mapper
    mockUserMapper = {
      toDomain: jest.fn((user) => {
        if (!user) return null;
        return new UserEntity(user);
      }),
    };

    // Mock pre TransactionHost
    mockTransactionHost = {
      tx: {}
    };

    // Vytvoríme inštanciu repozitára s mockmi
    repository = new PrismaUserRepository(
      mockTransactionHost as unknown as TransactionHost<TransactionalAdapterPrisma>,
      mockUserMapper as unknown as UserMapper,
    );

    // Získame vymockovaný BaseRepository
    mockBaseRepository = (repository as any).client;
  });

  describe('create', () => {
    it('should create a user and return domain entity', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser',
      };

      const mockPrismaUser: User = {
        id: 'mock-id',
        email: userData.email,
        passwordHash: userData.passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        phoneNumber: null,
        role: 'USER',
        disabled: false,
        verified: false,
        passwordAttempt: 0,
        lastLogin: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: null,
      };

      // Nastav mock pre create metódu
      mockBaseRepository.create.mockResolvedValue(mockPrismaUser);

      // Act
      const result = await repository.create(userData);

      // Assert
      expect(mockBaseRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: userData.email,
        passwordHash: userData.passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        verified: false,
        disabled: false,
      }));
      expect(mockUserMapper.toDomain).toHaveBeenCalledWith(mockPrismaUser);
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.id).toBe(mockPrismaUser.id);
    });

    it('should throw ConflictException when user with email already exists', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser',
      };

      // Simulujeme Prisma chybu pre duplicitný email
      const prismaError = new Error('Duplicate email') as any;
      prismaError.code = 'P2002';
      prismaError.name = 'PrismaClientKnownRequestError';
      prismaError.constructor = { name: 'PrismaClientKnownRequestError' };
      prismaError instanceof Prisma.PrismaClientKnownRequestError = true;

      mockBaseRepository.create.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(repository.create(userData)).rejects.toThrow(ConflictException);
      expect(mockBaseRepository.create).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a user by ID and return domain entity', async () => {
      // Arrange
      const userId = 'user-id';
      const mockPrismaUser: User = {
        id: userId,
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser',
        phoneNumber: null,
        role: 'USER',
        disabled: false,
        verified: true,
        passwordAttempt: 0,
        lastLogin: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: null,
      };

      mockBaseRepository.findById.mockResolvedValue(mockPrismaUser);

      // Act
      const result = await repository.findById(userId);

      // Assert
      expect(mockBaseRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserMapper.toDomain).toHaveBeenCalledWith(mockPrismaUser);
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.id).toBe(userId);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = 'non-existent-id';
      mockBaseRepository.findById.mockResolvedValue(null);

      // Act
      const result = await repository.findById(userId);

      // Assert
      expect(mockBaseRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserMapper.toDomain).toHaveBeenCalledWith(null);
      expect(result).toBeNull();
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email and return domain entity', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockPrismaUser: User = {
        id: 'user-id',
        email: email,
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser',
        phoneNumber: null,
        role: 'USER',
        disabled: false,
        verified: true,
        passwordAttempt: 0,
        lastLogin: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: null,
      };

      mockBaseRepository.findUnique.mockResolvedValue(mockPrismaUser);

      // Act
      const result = await repository.findUserByEmail(email);

      // Assert
      expect(mockBaseRepository.findUnique).toHaveBeenCalledWith({ email });
      expect(mockUserMapper.toDomain).toHaveBeenCalledWith(mockPrismaUser);
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.email).toBe(email);
    });
  });

  describe('update', () => {
    it('should update user properties and return domain entity', async () => {
      // Arrange
      const updateData = {
        id: 'user-id',
        firstName: 'Updated',
        lastName: 'User',
        phoneNumber: '+421123456789',
      };

      const mockUpdatedUser: User = {
        id: updateData.id,
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        userName: 'testuser',
        phoneNumber: updateData.phoneNumber,
        role: 'USER',
        disabled: false,
        verified: true,
        passwordAttempt: 0,
        lastLogin: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBaseRepository.update.mockResolvedValue(mockUpdatedUser);

      // Act
      const result = await repository.update(updateData);

      // Assert
      expect(mockBaseRepository.update).toHaveBeenCalledWith(
        updateData.id,
        expect.objectContaining({
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          phoneNumber: updateData.phoneNumber,
        })
      );
      expect(mockUserMapper.toDomain).toHaveBeenCalledWith(mockUpdatedUser);
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.firstName).toBe(updateData.firstName);
    });
  });

  describe('delete', () => {
    it('should delete a user by ID and return the deleted domain entity', async () => {
      // Arrange
      const userId = 'user-id';
      const mockDeletedUser: User = {
        id: userId,
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser',
        phoneNumber: null,
        role: 'USER',
        disabled: false,
        verified: true,
        passwordAttempt: 0,
        lastLogin: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: null,
      };

      mockBaseRepository.delete.mockResolvedValue(mockDeletedUser);

      // Act
      const result = await repository.delete(userId);

      // Assert
      expect(mockBaseRepository.delete).toHaveBeenCalledWith(userId);
      expect(mockUserMapper.toDomain).toHaveBeenCalledWith(mockDeletedUser);
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.id).toBe(userId);
    });
  });
});
