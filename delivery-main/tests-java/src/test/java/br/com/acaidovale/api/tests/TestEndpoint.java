package br.com.acaidovale.api.tests;

import java.util.UUID;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class TestEndpoint {

    private static final String BASE_URI = "https://acai-5ir2mi1gs-gabrielgc0608-2281s-projects.vercel.app";
    private static final int PORT = 3000;

    private Long clienteId;
    private String clienteEmail;
    private Long saborId;
    private Long adicionalId;
    private Long pedidoId;
    private String couponCode;

    @BeforeAll
    void setup() {
        RestAssured.baseURI = BASE_URI;
        RestAssured.port = PORT;

        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        clienteEmail = "test-client-" + uniqueId + "@example.com";

        Response clienteResponse = given()
                .contentType(ContentType.JSON)
                .body("{ \"nome\": \"Test Client\", \"email\": \"" + clienteEmail + "\", \"senha\": \"Password123!\" }")
            .when()
                .post("/api/clientes")
            .then()
                .statusCode(anyOf(is(200), is(201)))
                .extract()
                .response();

        clienteId = clienteResponse.path("id");

        Response saborResponse = given()
                .contentType(ContentType.JSON)
                .body("{ \"nome\": \"Test Sabor\", \"imagem\": \"test.jpg\" }")
            .when()
                .post("/api/sabores")
            .then()
                .statusCode(201)
                .extract()
                .response();

        saborId = saborResponse.path("id");

        Response adicionalResponse = given()
                .contentType(ContentType.JSON)
                .body("{ \"nome\": \"Test Adicional\" }")
            .when()
                .post("/api/adicionais")
            .then()
                .statusCode(201)
                .extract()
                .response();

        adicionalId = adicionalResponse.path("id");
    }

    @AfterAll
    void cleanup() {
        if (pedidoId != null) {
            given()
                .queryParam("id", pedidoId)
            .when()
                .delete("/api/pedidos")
            .then()
                .statusCode(anyOf(is(200), is(404)));
        }

        if (clienteId != null) {
            given()
                .queryParam("id", clienteId)
            .when()
                .delete("/api/clientes")
            .then()
                .statusCode(anyOf(is(200), is(404)));
        }

        if (saborId != null) {
            given()
                .queryParam("id", saborId)
            .when()
                .delete("/api/sabores")
            .then()
                .statusCode(anyOf(is(200), is(404)));
        }

        if (adicionalId != null) {
            given()
                .queryParam("id", adicionalId)
            .when()
                .delete("/api/adicionais")
            .then()
                .statusCode(anyOf(is(200), is(404)));
        }
    }

    @Test
    @Order(1)
    void shouldCreateAndFetchCustomer() {
        given()
            .queryParam("email", clienteEmail)
        .when()
            .get("/api/clientes")
        .then()
            .statusCode(200)
            .body("email", equalTo(clienteEmail))
            .body("nome", equalTo("Test Client"));
    }

    @Test
    @Order(2)
    void shouldUpdateCustomer() {
        given()
            .contentType(ContentType.JSON)
            .body("{ \"email\": \"" + clienteEmail + "\", \"nome\": \"Updated Test Client\" }")
        .when()
            .put("/api/clientes")
        .then()
            .statusCode(200)
            .body("nome", equalTo("Updated Test Client"));
    }

    @Test
    @Order(3)
    void shouldListFlavorsAndFindCreatedFlavor() {
        given()
        .when()
            .get("/api/v1/flavors")
        .then()
            .statusCode(200)
            .body("id", hasItem(saborId.intValue()));

        given()
        .when()
            .get("/api/v1/flavors/" + saborId)
        .then()
            .statusCode(200)
            .body("id", equalTo(saborId.intValue()));
    }

    @Test
    @Order(4)
    void shouldListAdditionalsAndFindCreatedAdditional() {
        given()
        .when()
            .get("/api/v1/additionals")
        .then()
            .statusCode(200)
            .body("id", hasItem(adicionalId.intValue()));

        given()
        .when()
            .get("/api/v1/additionals/" + adicionalId)
        .then()
            .statusCode(200)
            .body("id", equalTo(adicionalId.intValue()));
    }

    @Test
    @Order(5)
    void shouldCreateUpdateAndDeletePedido() {
        Response createResponse = given()
                .contentType(ContentType.JSON)
                .body("{ \"clienteId\": " + clienteId + ", \"sabores\": [{ \"id\": " + saborId + " }], \"adicionais\": [{ \"id\": " + adicionalId + " }], \"tamanho\": \"Grande\", \"valorTotal\": 50.5, \"formaPagamento\": \"Cartão de Crédito\", \"enderecoEntrega\": \"Rua Teste, 123\" }")
            .when()
                .post("/api/pedidos")
            .then()
                .statusCode(201)
                .body("clienteId", equalTo(clienteId.intValue()))
                .extract()
                .response();

        pedidoId = createResponse.path("id");

        given()
        .when()
            .get("/api/pedidos")
        .then()
            .statusCode(200)
            .body("id", hasItem(pedidoId.intValue()));

        given()
            .contentType(ContentType.JSON)
            .body("{ \"id\": " + pedidoId + ", \"formaPagamento\": \"Dinheiro\" }")
        .when()
            .put("/api/pedidos")
        .then()
            .statusCode(200)
            .body("formaPagamento", equalTo("Dinheiro"));

        given()
            .queryParam("id", pedidoId)
        .when()
            .delete("/api/pedidos")
        .then()
            .statusCode(200)
            .body("message", containsString("removido"));

        pedidoId = null;
    }

    @Test
    @Order(6)
    void shouldAuthenticateCustomerViaV1AuthLogin() {
        given()
            .contentType(ContentType.JSON)
            .body("{ \"email\": \"" + clienteEmail + "\", \"password\": \"Password123!\" }")
        .when()
            .post("/api/v1/auth/login")
        .then()
            .statusCode(200)
            .body("token", notNullValue())
            .body("customer.email", equalTo(clienteEmail));
    }

    @Test
    @Order(7)
    void shouldCreateListValidateAndPatchCoupon() {
        couponCode = "TESTCOUPON-" + UUID.randomUUID().toString().substring(0, 8);

        given()
            .contentType(ContentType.JSON)
            .body("{ \"codigo\": \"" + couponCode + "\", \"descricao\": \"Cupom de teste\", \"tipo\": \"fixed\", \"valor\": 10, \"valorMinimo\": 30, \"usoMaximo\": 5, \"expiraEm\": \"2099-12-31T23:59:59.000Z\", \"ativo\": true }")
        .when()
            .post("/api/v1/coupons")
        .then()
            .statusCode(201)
            .body("codigo", equalTo(couponCode));

        given()
        .when()
            .get("/api/v1/coupons")
        .then()
            .statusCode(200)
            .body("codigo", hasItem(couponCode));

        given()
            .queryParam("codigo", couponCode)
            .queryParam("valorTotal", 50)
        .when()
            .get("/api/v1/coupons/validate")
        .then()
            .statusCode(200)
            .body("desconto", equalTo(10.0f))
            .body("totalComDesconto", equalTo(40.0f));

        given()
            .contentType(ContentType.JSON)
            .body("{ \"codigo\": \"" + couponCode + "\", \"ativo\": false }")
        .when()
            .patch("/api/v1/coupons")
        .then()
            .statusCode(200)
            .body("ativo", equalTo(false));
    }
}