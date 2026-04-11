
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = 'http://localhost:3000';

describe('API Integration Tests', () => {
  let cliente: any;
  let sabor: any;
  let adicional: any;
  let pedido: any;
  let cupom: any;

  beforeAll(async () => {
    await prisma.pedido.deleteMany({});
    await prisma.cupom.deleteMany({});
    await prisma.fidelidadeTransacao.deleteMany({});
    await prisma.cliente.deleteMany({});
    await prisma.sabor.deleteMany({});
    await prisma.adicional.deleteMany({});

    const clienteResponse = await request(app)
      .post('/api/clientes')
      .send({
        nome: 'Test Client',
        email: 'test-client@example.com',
        senha: 'password123',
      });

    cliente = clienteResponse.body;

    const saborResponse = await request(app)
      .post('/api/sabores')
      .send({
        nome: 'Test Sabor',
        imagem: 'test.jpg',
      });

    sabor = saborResponse.body;

    const adicionalResponse = await request(app)
      .post('/api/adicionais')
      .send({
        nome: 'Test Adicional',
      });

    adicional = adicionalResponse.body;
  });

  afterAll(async () => {
    await prisma.pedido.deleteMany({});
    await prisma.cupom.deleteMany({});
    await prisma.fidelidadeTransacao.deleteMany({});
    await prisma.cliente.deleteMany({});
    await prisma.sabor.deleteMany({});
    await prisma.adicional.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create and fetch a customer via root /api/clientes', async () => {
    const response = await request(app)
      .get('/api/clientes')
      .query({ email: cliente.email });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(cliente.email);
    expect(response.body.nome).toBe(cliente.nome);
  });

  it('should update the customer via root /api/clientes', async () => {
    const response = await request(app)
      .put('/api/clientes')
      .send({
        email: cliente.email,
        nome: 'Updated Test Client',
      });

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe('Updated Test Client');
  });

  it('should create and fetch sabor via root /api/sabores', async () => {
    const response = await request(app).get('/api/sabores');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((item: any) => item.id === sabor.id)).toBe(true);
  });

  it('should create and fetch adicional via root /api/adicionais', async () => {
    const response = await request(app).get('/api/adicionais');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((item: any) => item.id === adicional.id)).toBe(true);
  });

  it('should create an order via root /api/pedidos and then update and delete it', async () => {
    const createResponse = await request(app)
      .post('/api/pedidos')
      .send({
        clienteId: cliente.id,
        sabores: [{ id: sabor.id }],
        adicionais: [{ id: adicional.id }],
        tamanho: 'Grande',
        valorTotal: 50.5,
        formaPagamento: 'Cartão de Crédito',
        enderecoEntrega: 'Rua Teste, 123',
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.clienteId).toBe(cliente.id);

    pedido = createResponse.body;

    const listResponse = await request(app).get('/api/pedidos');
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body.some((item: any) => item.id === pedido.id)).toBe(true);

    const updateResponse = await request(app)
      .put('/api/pedidos')
      .send({
        id: pedido.id,
        formaPagamento: 'Dinheiro',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.formaPagamento).toBe('Dinheiro');

    const deleteResponse = await request(app).delete('/api/pedidos').query({ id: pedido.id });
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toMatch(/removido com sucesso/i);
  });

  it('should authenticate customer via v1 /api/v1/auth/login', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: cliente.email,
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.customer.email).toBe(cliente.email);
  });

  it('should create, list, validate and patch a coupon via /api/v1/coupons', async () => {
    const codigo = `TESTCOUPON-${Date.now()}`;

    const createResponse = await request(app)
      .post('/api/v1/coupons')
      .send({
        codigo,
        descricao: 'Cupom de teste',
        tipo: 'fixed',
        valor: 10,
        valorMinimo: 30,
        usoMaximo: 5,
        expiraEm: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        ativo: true,
      });

    expect(createResponse.status).toBe(201);
    cupom = createResponse.body;
    expect(cupom.codigo).toBe(codigo);

    const listResponse = await request(app).get('/api/v1/coupons');
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body.some((item: any) => item.codigo === codigo)).toBe(true);

    const validateResponse = await request(app)
      .get('/api/v1/coupons/validate')
      .query({ codigo, valorTotal: 50 });

    expect(validateResponse.status).toBe(200);
    expect(validateResponse.body.desconto).toBe(10);
    expect(validateResponse.body.totalComDesconto).toBe(40);

    const patchResponse = await request(app)
      .patch('/api/v1/coupons')
      .send({ codigo, ativo: false });

    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.ativo).toBe(false);
  });

  it('should list flavors via /api/v1/flavors and get flavor by id', async () => {
    const listResponse = await request(app).get('/api/v1/flavors');

    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body.some((item: any) => item.id === sabor.id)).toBe(true);

    const getByIdResponse = await request(app).get(`/api/v1/flavors/${sabor.id}`);
    expect(getByIdResponse.status).toBe(200);
    expect(getByIdResponse.body.id).toBe(sabor.id);
  });

  it('should list additionals via /api/v1/additionals and get adicional by id', async () => {
    const listResponse = await request(app).get('/api/v1/additionals');

    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body.some((item: any) => item.id === adicional.id)).toBe(true);

    const getByIdResponse = await request(app).get(`/api/v1/additionals/${adicional.id}`);
    expect(getByIdResponse.status).toBe(200);
    expect(getByIdResponse.body.id).toBe(adicional.id);
  });
});
