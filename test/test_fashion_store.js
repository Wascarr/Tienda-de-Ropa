// Importaciones necesarias
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const screenshotDir = 'test/screenshots';

async function takeScreenshot(driver, name) {
    const screenshot = await driver.takeScreenshot();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.writeFileSync(
        path.join(screenshotDir, `${name}-${timestamp}.png`),
        screenshot,
        'base64'
    );
}

describe('Pruebas Fashion Store', function() {
    let driver;

    before(async function() {
        if (!fs.existsSync(screenshotDir)){
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize();
    });

    beforeEach(async function() {
        await driver.get('file://' + path.resolve(__dirname, '../src/index.html'));
    });

    it('HU001 - Agregar al Carrito', async function() {
        const botonAgregar = await driver.findElement(By.className('btn-comprar'));
        const contadorInicial = await driver.findElement(By.className('carrito-numero')).getText();
        
        await botonAgregar.click();
        await driver.sleep(1000);
        
        const contadorNuevo = await driver.findElement(By.className('carrito-numero')).getText();
        assert.notEqual(contadorInicial, contadorNuevo);
        await takeScreenshot(driver, 'agregar-al-carrito');
    });

    it('HU002 - Visualizar Carrito', async function() {
        const botonAgregar = await driver.findElement(By.className('btn-comprar'));
        await botonAgregar.click();
        await driver.sleep(1000);
        
        const carritoContainer = await driver.findElement(By.className('carrito-container'));
        await carritoContainer.click();
        
        const modalCarrito = await driver.wait(until.elementLocated(By.id('carrito-modal')), 5000);
        assert(await modalCarrito.isDisplayed());
        await takeScreenshot(driver, 'visualizar-carrito');
    });

    it('HU003 - Gestión de Cantidad', async function() {
        await driver.findElement(By.className('btn-comprar')).click();
        await driver.sleep(1000);
        await driver.findElement(By.className('carrito-container')).click();
        
        const botonSumar = await driver.wait(until.elementLocated(By.className('btn-sumar')), 5000);
        await botonSumar.click();
        
        const cantidad = await driver.findElement(By.className('cantidad-numero')).getText();
        assert.equal(cantidad, '2');
        await takeScreenshot(driver, 'gestion-cantidad');
    });

    it('HU004 - Eliminar Producto', async function() {
        await driver.findElement(By.className('btn-comprar')).click();
        await driver.sleep(1000);
        await driver.findElement(By.className('carrito-container')).click();
        
        const botonEliminar = await driver.wait(until.elementLocated(By.className('btn-eliminar')), 5000);
        await botonEliminar.click();
        
        const itemsCarrito = await driver.findElements(By.className('carrito-item'));
        assert.equal(itemsCarrito.length, 0);
        await takeScreenshot(driver, 'eliminar-producto');
    });

    it('HU005 - Proceso de Pago', async function() {
        await driver.findElement(By.className('btn-comprar')).click();
        await driver.sleep(1000);
        await driver.findElement(By.className('carrito-container')).click();
        
        const botonCheckout = await driver.wait(until.elementLocated(By.id('checkout-btn')), 5000);
        await botonCheckout.click();
        
        await driver.wait(until.alertIsPresent());
        const alert = await driver.switchTo().alert();
        await alert.accept();
        
        const contadorCarrito = await driver.findElement(By.className('carrito-numero')).getText();
        assert.equal(contadorCarrito, '0');
        await takeScreenshot(driver, 'proceso-pago');
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        }
    });
});
