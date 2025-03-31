import { Test } from '@nestjs/testing';
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { PrismaService } from '../src/modules/prisma/services/prisma.service';
import { PrismaUserRepository, UserMapper } from '../src/modules/prisma/repositories/prisma-user.repository';
import { ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';

describe('PrismaUserRepository (Integration)', () => {
  let repository: PrismaUserRepository;
  let prismaService: PrismaService;
  let transactionHost: TransactionHost<TransactionalAdapterPrisma>;
  let userMapper: UserMapper;

  beforeAll(async () => {
    // Inicializácia testovacieho modulu
    const moduleRef = await Test.createTestingModule({
      providers: [
        PrismaService,
        UserMapper,
        {
          provide: TransactionHost,
          useFactory: (prismaService: PrismaService) => {
            return new TransactionHost<TransactionalAdapterPrisma>({
              adapter: new TransactionalAdapterPrisma({
                prismaClient: prismaService,
              }),
            });
          },
          inject: [PrismaService],
        },
        PrismaUserRepository,
      ],
    }).compile();

    repository = moduleRef.get<PrismaUserRepository>(PrismaUserRepository);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    transactionHost = moduleRef.get<TransactionHost<TransactionalAdapterPrisma>>(TransactionHost);
    userMapper = moduleRef.get<UserMapper>(UserMapper);
  });

  beforeEach(async () => {
    // Vyčistíme databázu pred každým testom
    await prismaService.appToken.deleteMany();
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    // Zatvoríme pripojenie k databáze po testoch
    await prismaService.$disconnect();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User',
        userName: 'testuser',
      };

      // Act
      const createdUser = await repository.create(userData);

      // Assert
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.firstName).toBe(userData.firstName);
      expect(createdUser.lastName).toBe(userData.lastName);
      expect(createdUser.userName).toBe(userData.userName);
      expect(createdUser.disabled).toBe(false); // Defaultná hodnota
      expect(createdUser.verified).toBe(false); // Defaultná hodnota

      // Overiť, že používateľ je naozaj v databáze
      const userInDb = await prismaService.user.findUnique({
        where: { email: userData.email }
      });
      expect(userInDb).toBeDefined();
      expect(userInDb.id).toBe(createdUser.id);
    });

    it('should throw ConflictException when user with email already exists', async () => {
      // Arrange
      const userData = {
        email: 'duplicate@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Duplicate',
        lastName: 'User',
        userName: 'duplicateuser',
      };

      // Najprv vytvoríme používateľa priamo cez Prisma službu
      await prismaService.user.create({
        data: {
          email: userData.email,
          passwordHash: userData.passwordHash,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
          disabled: false,
          verified: false,
        }
      });

      // Act & Assert
      await expect(repository.create(userData)).rejects.toThrow(ConflictException);
    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      // Arrange - vytvoríme používateľa priamo v DB
      const userData = {
        email: 'findbyid@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'FindById',
        lastName: 'User',
        userName: 'findbyiduser',
        disabled: false,
        verified: false,
      };

      const createdUser = await prismaService.user.create({ data: userData });

      // Act
      const foundUser = await repository.findById(createdUser.id);

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(createdUser.id);
      expect(foundUser.email).toBe(userData.email);
    });

    it('should return null when user with ID does not exist', async () => {
      // Act
      const result = await repository.findById('non-existent-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      // Arrange
      const userData = {
        email: 'findbyemail@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'FindByEmail',
        lastName: 'User',
        userName: 'findbyemailuser',
        disabled: false,
        verified: false,
      };

      await prismaService.user.create({ data: userData });

      // Act
      const foundUser = await repository.findUserByEmail(userData.email);

      // Assert
      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe(userData.email);
    });
  });

  describe('update', () => {
    it('should update user properties', async () => {
      // Arrange
      const initialData = {
        email: 'update@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Update',
        lastName: 'User',
        userName: 'updateuser',
        disabled: false,
        verified: false,
      };

      const createdUser = await prismaService.user.create({ data: initialData });

      const updateData = {
        id: createdUser.id,
        firstName: 'UpdatedName',
        lastName: 'UpdatedLastName',
        phoneNumber: '+421123456789',
      };

      // Act
      const updatedUser = await repository.update(updateData);

      // Assert
      expect(updatedUser).toBeDefined();
      expect(updatedUser.firstName).toBe(updateData.firstName);
      expect(updatedUser.lastName).toBe(updateData.lastName);
      expect(updatedUser.phoneNumber).toBe(updateData.phoneNumber);
      
      // Overiť, že zmeny sú v databáze
      const userInDb = await prismaService.user.findUnique({
        where: { id: createdUser.id }
      });
      expect(userInDb.firstName).toBe(updateData.firstName);
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      // Arrange
      const userData = {
        email: 'delete@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Delete',
        lastName: 'User',
        userName: 'deleteuser',
        disabled: false,
        verified: false,
      };

      const createdUser = await prismaService.user.create({ data: userData });

      // Act
      const deletedUser = await repository.delete(createdUser.id);

      // Assert
      expect(deletedUser).toBeDefined();
      expect(deletedUser.id).toBe(createdUser.id);

      // Overíme, že používateľ už nie je v databáze
      const userInDb = await prismaService.user.findUnique({
        where: { id: createdUser.id }
      });
      expect(userInDb).toBeNull();
    });
  });
});
