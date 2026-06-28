import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Smartphone Pro Max',
    price: 899990,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
    description: 'Pantalla OLED 6.7 pulgadas, 256GB almacenamiento, triple cámara 48MP.',
    category: 'Tecnología'
  },
  {
    name: 'Laptop Developer Edition',
    price: 1299990,
    stock: 8,
    imageUrl: '/img/laptop.png',
    description: '16GB RAM, 512GB SSD, Intel Core i7, tarjeta gráfica integrada Iris Xe.',
    category: 'Tecnología'
  },
  {
    name: 'Auriculares ANC Premium',
    price: 149990,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
    description: 'Cancelación de ruido activa híbrida, bluetooth 5.2, batería de 30 horas.',
    category: 'Audio'
  },
  {
    name: 'Monitor 4K UltraWide',
    price: 399990,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400',
    description: 'Pantalla de 34 pulgadas IPS, HDR 400, tasa de refresco 75Hz.',
    category: 'Tecnología'
  },
  {
    name: 'Teclado Mecánico RGB',
    price: 79990,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400',
    description: 'Switches Cherry MX Red, retroiluminación RGB configurable, layout en español.',
    category: 'Accesorios'
  },
  {
    name: 'Ratón Ergonómico Wireless',
    price: 49990,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400',
    description: 'Conexión inalámbrica 2.4Ghz y Bluetooth, batería recargable USB-C, diseño ergonómico.',
    category: 'Accesorios'
  },
  {
    name: 'Smartwatch Fitness Tracker',
    price: 129990,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400',
    description: 'GPS integrado, monitor de ritmo cardíaco, resistente al agua 50m, batería de 7 días.',
    category: 'Tecnología'
  },
  {
    name: 'Altavoz Inteligente con Asistente',
    price: 59990,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=400',
    description: 'Sonido de 360 grados, control por voz inteligente, compatible con casas domotizadas.',
    category: 'Audio'
  },
  {
    name: 'Cámara de Seguridad Wi-Fi',
    price: 39990,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=400',
    description: 'Resolución Full HD 1080p, visión nocturna infrarroja, detección de movimiento y audio bidireccional.',
    category: 'Hogar Inteligente'
  },
  {
    name: 'Bombilla Inteligente LED RGB',
    price: 12990,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=400',
    description: 'Rosca E27 estándar, 16 millones de colores regulables mediante app, control por voz.',
    category: 'Hogar Inteligente'
  },
  {
    name: 'Enchufe Inteligente Wi-Fi',
    price: 14990,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1560731773-45c110b64be1?auto=format&fit=crop&q=80&w=400',
    description: 'Monitoreo de consumo de energía, programación horaria integrada, control remoto.',
    category: 'Hogar Inteligente'
  },
  {
    name: 'Hub USB-C de 8 Puertos',
    price: 34990,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=400',
    description: 'Salida HDMI 4K, 3 puertos USB 3.0, lector tarjetas SD/TF y puerto de carga PD 100W.',
    category: 'Accesorios'
  },
  {
    name: 'Cargador Rápido GaN 65W',
    price: 29990,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=400',
    description: 'Tecnología Nitruro de Galio, 2 puertos USB-C y 1 puerto USB-A. Carga rápida ultra compacta.',
    category: 'Accesorios'
  },
  {
    name: 'Micrófono USB para Streaming',
    price: 89990,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400',
    description: 'Patrón polar cardioide, botón de silencio capacitivo, salida de auriculares sin latencia.',
    category: 'Audio'
  },
  {
    name: 'Barra de Sonido Compacta',
    price: 119990,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=400',
    description: 'Conexión HDMI ARC y Óptica, Bluetooth 5.0, sonido envolvente Dolby Digital.',
    category: 'Audio'
  },
  {
    name: 'Soporte para Portátil de Aluminio',
    price: 24990,
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=400',
    description: 'Diseño ergonómico ajustable en 6 niveles de altura, almohadillas antideslizantes de silicona.',
    category: 'Oficina'
  },
  {
    name: 'Silla Ergonómica de Oficina',
    price: 199990,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&q=80&w=400',
    description: 'Soporte lumbar ajustable en altura y profundidad, reposabrazos 3D, malla transpirable.',
    category: 'Oficina'
  },
  {
    name: 'Lámpara de Escritorio LED Inteligente',
    price: 39990,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400',
    description: 'Control de brillo continuo, temperatura de color ajustable (2700K - 6500K), temporizador.',
    category: 'Oficina'
  },
  {
    name: 'Mochila Impermeable para Portátil',
    price: 44990,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400',
    description: 'Compartimento acolchado para portátiles de hasta 15.6", puerto de carga USB exterior.',
    category: 'Oficina'
  },
  {
    name: 'Disco Duro Externo SSD 1TB',
    price: 99990,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    description: 'Velocidad de transferencia ultra rápida de hasta 1050 MB/s, resistente a caídas y golpes.',
    category: 'Tecnología'
  },
  {
    name: 'Tarjeta de Memoria MicroSD 128GB',
    price: 19990,
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1546027658-7da7501622b1?auto=format&fit=crop&q=80&w=400',
    description: 'Velocidad de lectura de hasta 100 MB/s clase U3, ideal para cámaras 4K y smartphones.',
    category: 'Accesorios'
  },
  {
    name: 'Power Bank 20.000mAh',
    price: 27990,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1609592424087-73d843477141?auto=format&fit=crop&q=80&w=400',
    description: 'Carga rápida bidireccional PD de 20W, salidas USB duales y entrada USB-C, indicador digital LED.',
    category: 'Accesorios'
  },
  {
    name: 'Router Wi-Fi 6 Mesh',
    price: 149990,
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400',
    description: 'Velocidades de hasta 3000 Mbps, cobertura para toda la casa, conecta hasta 150 dispositivos sin latencia.',
    category: 'Tecnología'
  },
  {
    name: 'Webcam Full HD 1080p',
    price: 54990,
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1600541519468-4a9121c97a82?auto=format&fit=crop&q=80&w=400',
    description: 'Enfoque automático integrado, micrófono doble con cancelación de ruido, tapa de privacidad.',
    category: 'Tecnología'
  },
  {
    name: 'Tableta Gráfica para Dibujo',
    price: 89990,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400',
    description: '8192 niveles de presión del lápiz sin batería, área de trabajo activa de 10x6 pulgadas.',
    category: 'Tecnología'
  },
  {
    name: 'Mando Inalámbrico para Consola',
    price: 59990,
    stock: 28,
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=400',
    description: 'Conectividad Bluetooth, retroalimentación táctil de vibración, conector de auriculares de 3.5mm.',
    category: 'Tecnología'
  },
  {
    name: 'Alfombrilla de Ratón XXL',
    price: 14990,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400',
    description: 'Superficie de tela optimizada para deslizamiento rápido y control, base de goma antideslizante, 90x40cm.',
    category: 'Accesorios'
  },
  {
    name: 'Soporte para Monitor de Mesa',
    price: 32990,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=400',
    description: 'Brazo articulado de gas para monitores de hasta 32 pulgadas, ajuste de altura y ángulo de visión.',
    category: 'Oficina'
  },
  {
    name: 'Organizador de Cables de Silicona',
    price: 7990,
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400',
    description: 'Pack de 5 piezas adhesivas con 5 ranuras cada una. Mantén tus cables ordenados en el escritorio.',
    category: 'Accesorios'
  },
  {
    name: 'Gafas con Filtro de Luz Azul',
    price: 17990,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=400',
    description: 'Montura ligera de policarbonato, lentes antirreflectantes que reducen la fatiga visual digital.',
    category: 'Oficina'
  },
  {
    name: 'Limpiador de Pantallas Kit',
    price: 9990,
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1585076694015-a6157f8dd812?auto=format&fit=crop&q=80&w=400',
    description: 'Fórmula sin alcohol ni amoníaco, frasco spray de 100ml e incluye 2 paños de microfibra premium.',
    category: 'Accesorios'
  },
  {
    name: 'Trípode Flexible para Móvil',
    price: 12990,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400',
    description: 'Patas estilo pulpo articuladas ajustables, soporte universal giratorio y control remoto bluetooth.',
    category: 'Accesorios'
  },
  {
    name: 'Proyector Mini LED Portable',
    price: 189990,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=400',
    description: 'Resolución nativa 720p (soporta 1080p), altavoz integrado, conexiones HDMI, USB y AV.',
    category: 'Tecnología'
  },
  {
    name: 'Mini Aspiradora de Escritorio',
    price: 14990,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1528740561666-424779275653?auto=format&fit=crop&q=80&w=400',
    description: 'Alimentación por batería interna recargable por USB, cepillo de nylon inferior para residuos pequeños.',
    category: 'Oficina'
  },
  {
    name: 'Termo Inteligente con Pantalla',
    price: 19990,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400',
    description: 'Pantalla táctil LCD en la tapa que muestra la temperatura exacta del líquido, acero inoxidable.',
    category: 'Oficina'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Limpiar catálogo previo
    await Product.deleteMany({});
    console.log('Catálogo de productos limpio.');

    // Insertar nuevos productos
    await Product.insertMany(sampleProducts);
    console.log('Base de datos poblada con productos de muestra.');

    mongoose.connection.close();
    console.log('Conexión cerrada.');
  } catch (error) {
    console.error(`Error sembrando la base de datos: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
