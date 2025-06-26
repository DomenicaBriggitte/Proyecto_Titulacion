import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes = [
    { cedula: '0993192686001', nombre: 'ABC MOTOR ABCM S.A.', tipo: 'Jurídica', telefono: '0991234567', correo: 'abc@ejemplo.com' },
    { cedula: '0992768193001', nombre: 'ACERCORP S. A.', tipo: 'Jurídica', telefono: '0992345678', correo: 'acercorp@ejemplo.com' },
    { cedula: '1792605504001', nombre: 'ADESGAE CIA. LTDA', tipo: 'Jurídica', telefono: '0993456789', correo: 'adesgae@ejemplo.com' },
    { cedula: '0992922362001', nombre: 'AGROINDUSTRIAS BEJARANO S. A.', tipo: 'Jurídica', telefono: '0994567890', correo: 'agroindustrias@ejemplo.com' },
    { cedula: '0922886551001', nombre: 'ALEXANDRA LINO ALAVA', tipo: 'Natural', telefono: '0995678901', correo: 'alexandra@ejemplo.com' },
    { cedula: '2390011639001', nombre: 'ANA LUCILA RAMOS HERRERA CIA. LTDA.', tipo: 'Jurídica', telefono: '0996789012', correo: 'ana@ejemplo.com' },
    { cedula: '1301363089001', nombre: 'Antonio Tejena Delgado', tipo: 'Natural', telefono: '0997890123', correo: 'antonio@ejemplo.com' },
    { cedula: '0993379537001', nombre: 'ARMACK CONSTRUCCIONES S.A.S.', tipo: 'Jurídica', telefono: '0998901234', correo: 'armack@ejemplo.com' },
    { cedula: '0992614943001', nombre: 'Asociación de Propietarios Mallorca', tipo: 'Jurídica', telefono: '0999012345', correo: 'asociacion@ejemplo.com' },
    { cedula: '0991331859001', nombre: 'ATIMASA S.A.', tipo: 'Jurídica', telefono: '0990123456', correo: 'atimasasa@ejemplo.com' },
    { cedula: '1710939073001', nombre: 'AVEIGA RODRIGUEZ ALBA LILIANA', tipo: 'Natural', telefono: '0991239876', correo: 'liliana@ejemplo.com' },
    { cedula: '0990379017001', nombre: 'BANCO BOLIVARIANO C.A.', tipo: 'Jurídica', telefono: '0992348765', correo: 'banco@ejemplo.com' },
    { cedula: '0993375673001', nombre: 'Bloquera El Tigre Jr S. A. S.', tipo: 'Jurídica', telefono: '0993457654', correo: 'bloquera@ejemplo.com' },
    { cedula: '0907264659001', nombre: 'Bolívar E. Dávila García', tipo: 'Natural', telefono: '0994562345', correo: 'bolivar@ejemplo.com' },
    { cedula: '0912776358001', nombre: 'CABRERA VASQUEZ JOHNNY LORENZO', tipo: 'Natural', telefono: '0995673456', correo: 'johnny@ejemplo.com' },
    { cedula: '0992351144001', nombre: 'CALIZAS HUAYCO S. A.', tipo: 'Jurídica', telefono: '0996784567', correo: 'calizas@ejemplo.com' },
    { cedula: '0802161208001', nombre: 'CANGO CANGO DORILA ELVIRA', tipo: 'Natural', telefono: '0997895678', correo: 'dorila@ejemplo.com' },
    { cedula: '0919538553001', nombre: 'CARLOS ALBERTO JACKE ROSERO', tipo: 'Natural', telefono: '0998906789', correo: 'carlos@ejemplo.com' },
    { cedula: '1102762174001', nombre: 'CASTILLO TORRES CECILIA ALEXANDRA', tipo: 'Natural', telefono: '0999017890', correo: 'cecilia@ejemplo.com' },
    { cedula: '1103174445001', nombre: 'CASTILLO TORRES OMERO FERNANDO', tipo: 'Natural', telefono: '0990128901', correo: 'omero@ejemplo.com' },
    { cedula: '0991165711001', nombre: 'CEUSKY S. A.', tipo: 'Jurídica', telefono: '0991238902', correo: 'ceusky@ejemplo.com' },
    { cedula: '0913932745001', nombre: 'CHIRIBOGA LOPEZ MAURO ARMANDO', tipo: 'Natural', telefono: '0992348903', correo: 'mauro@ejemplo.com' },
    { cedula: '0991446508001', nombre: 'COMERCIAL K.R.O.N. S.A.', tipo: 'Jurídica', telefono: '0993451234', correo: 'comercial@ejemplo.com' },
    { cedula: '0992956348001', nombre: 'COMERCIALIZADORA ENERCOM SERVICIOS ENERCOMSER S A 2', tipo: 'Jurídica', telefono: '0994561234', correo: 'enercom@ejemplo.com' },
    { cedula: '0992334606001', nombre: 'Comercializadora SER WAY S. A.', tipo: 'Jurídica', telefono: '0995672345', correo: 'serway@ejemplo.com' },
    { cedula: '0991503102001', nombre: 'CONCESIONARIA DEL GUAYAS CONCEGUA S.A.', tipo: 'Jurídica', telefono: '0996783456', correo: 'concegua@ejemplo.com' },
    { cedula: '0991503331001', nombre: 'CONCESIONARIA NORTE CONORTE S.A.', tipo: 'Jurídica', telefono: '0997894567', correo: 'conorte@ejemplo.com' },
    { cedula: '0993376009001', nombre: 'Consorcio Neoportete', tipo: 'Jurídica', telefono: '0998905678', correo: 'neoportete@ejemplo.com' },
    { cedula: '0993354074001', nombre: 'CONSPROES S. A. S.', tipo: 'Jurídica', telefono: '0999016789', correo: 'consproes@ejemplo.com' },
    { cedula: '0992415061001', nombre: 'CONSTRUCTORA CAMINOS Y MINAS CONCAMIN CIA. LTDA.', tipo: 'Jurídica', telefono: '0990127890', correo: 'concammin@ejemplo.com' },
    { cedula: '9999999999999', nombre: 'Consumidor Final', tipo: 'Natural', telefono: '0991238901', correo: 'consumidorfinal@ejemplo.com' },
    { cedula: '0990117667001', nombre: 'COOPERATIVA DE TRANSPORTE PUBLICO DE PASAJEROS URBANO NUEVA UNION LTDA G 9', tipo: 'Jurídica', telefono: '0992349012', correo: 'nuevaunion@ejemplo.com' },
    { cedula: '0101900330001', nombre: 'CORONEL FLORES GUILLERMO EBELIO', tipo: 'Natural', telefono: '0993450123', correo: 'guillermo@ejemplo.com' },
    { cedula: '0990004196001', nombre: 'CORPORACION EL ROSADO S.A.', tipo: 'Jurídica', telefono: '0994561235', correo: 'elrosado@ejemplo.com' },
    { cedula: '1790016919001', nombre: 'CORPORACION FAVORITA C.A.', tipo: 'Jurídica', telefono: '0995672346', correo: 'favorita@ejemplo.com' },
    { cedula: '0990617988001', nombre: 'Corporación Técnica de Equipos y Construcción Cotecec Cía Ltda.', tipo: 'Jurídica', telefono: '0996783457', correo: 'cotecec@ejemplo.com' },
    { cedula: '0905357422001', nombre: 'CORRALES PENAFIEL AIDA MAGDALENA', tipo: 'Natural', telefono: '0997891234', correo: 'aida@ejemplo.com' },
    { cedula: '2490031882001', nombre: 'CORREDOR VIAL DE LA COSTA CVIALCO S.A.', tipo: 'Jurídica', telefono: '0998902345', correo: 'cvialco@ejemplo.com' },
    { cedula: '0992624337001', nombre: 'COSTAKARIM S.A.', tipo: 'Jurídica', telefono: '0999013456', correo: 'costakarim@ejemplo.com' },
    { cedula: '1793080561001', nombre: 'DBASPORT SAS', tipo: 'Jurídica', telefono: '0990124567', correo: 'dbasport@ejemplo.com' },
    { cedula: '0990818231001', nombre: 'DISTRIAZUL DISTRIBUIDORA DE COMBUSTIBLES CIA LTDA', tipo: 'Jurídica', telefono: '0991235678', correo: 'distriazul@ejemplo.com' },
    { cedula: '0993124400001', nombre: 'DISTRIBORJA II BVBN S.A.', tipo: 'Jurídica', telefono: '0992346789', correo: 'distriborja@ejemplo.com' },
    { cedula: '0993074659001', nombre: 'DISTRIBUIDORA DE COMBUSTIBLES LIQUIDOS DISCOMLIQ S.A.', tipo: 'Jurídica', telefono: '0993457890', correo: 'discomliq@ejemplo.com' },
    { cedula: '0992921404001', nombre: 'DISTRIBUIDORA DE DERIVADOS Y PRODUCTOS PETROLEROS DIDESPROPE S.A.', tipo: 'Jurídica', telefono: '0994568901', correo: 'didesprope@ejemplo.com' },
    { cedula: '0993198382001', nombre: 'DISTRIBUIDORA PERIMETRAL DE COMBUSTIBLES LIQUIDOS DIPERCOMLIQ CIA. LTDA', tipo: 'Jurídica', telefono: '0995679012', correo: 'dipercomliq@ejemplo.com' },
    { cedula: '0990007241001', nombre: 'ECUATORIANA DE SAL Y PRODUCTOS QUIMICOS CA ECUASAL', tipo: 'Jurídica', telefono: '0996780123', correo: 'ecuatorial@ejemplo.com' },
    { cedula: '0904813664001', nombre: 'EDILMA TORAL FEIJO', tipo: 'Natural', telefono: '0997891234', correo: 'edilma@ejemplo.com' },
    { cedula: '0190497666001', nombre: 'EIMEPARTS S.A.S', tipo: 'Jurídica', telefono: '0998902345', correo: 'eimeparts@ejemplo.com' },
    { cedula: '0992539380001', nombre: 'ESCRITORNI S.A.', tipo: 'Jurídica', telefono: '0999013456', correo: 'escritorni@ejemplo.com' },
    { cedula: '2490035284001', nombre: 'ESTACION CHANDUY GASOLEXPRESS SA', tipo: 'Jurídica', telefono: '0990124567', correo: 'gasoexpress@ejemplo.com' },
    { cedula: '0992739401001', nombre: 'ESTACION DE SERVICIOS ALPASO S.A.', tipo: 'Jurídica', telefono: '0991235678', correo: 'alpaso@ejemplo.com' },
    { cedula: '0391011729001', nombre: 'ESTRINSA ESTACION DE SERVICIO EL TRIUNFO SA', tipo: 'Jurídica', telefono: '0992346789', correo: 'estrinsa@ejemplo.com' },
    { cedula: '0993028932001', nombre: 'ESTSERHMIGUEL S.A.', tipo: 'Jurídica', telefono: '0993457890', correo: 'estserehmiguel@ejemplo.com' },
    { cedula: '0102410404001', nombre: 'FERNÁNDEZ VINTIMILLA GERARD XAVIER', tipo: 'Natural', telefono: '0994568901', correo: 'gerard@ejemplo.com' },
    { cedula: '0992256230001', nombre: 'FERREMUNDO S A', tipo: 'Jurídica', telefono: '0995679012', correo: 'ferremundo@ejemplo.com' },
    { cedula: '0992917768001', nombre: 'Ferretería y Seguridad Ferresegsa S. A.', tipo: 'Jurídica', telefono: '0996780123', correo: 'ferresegsa@ejemplo.com' },
    { cedula: '0919701763001', nombre: 'FRANCISCO GRAU SACOTO', tipo: 'Natural', telefono: '0997892345', correo: 'francisco@ejemplo.com' },
    { cedula: '1710904192001', nombre: 'GARZON NAVAS SANTIAGO MAURICIO', tipo: 'Natural', telefono: '0998903456', correo: 'garzon@ejemplo.com' },
    { cedula: '0992332905001', nombre: 'GAS-ELIALEHI CIA. LTDA.', tipo: 'Jurídica', telefono: '0999014567', correo: 'gaselialehi@ejemplo.com' },
    { cedula: '0993256560001', nombre: 'GASOCORP S.A', tipo: 'Jurídica', telefono: '0990125678', correo: 'gasocorp@ejemplo.com' },
    { cedula: '0993369627001', nombre: 'GASOLINERAS COPEDESA GASGRUPCO S.A.', tipo: 'Jurídica', telefono: '0991236789', correo: 'copedesagruco@ejemplo.com' },
    { cedula: '0992704187001', nombre: 'GASOP COMPANY S.A.', tipo: 'Jurídica', telefono: '0992347890', correo: 'gasop@ejemplo.com' },
    { cedula: '0992968435001', nombre: 'GASOVIP S.A.', tipo: 'Jurídica', telefono: '0993458901', correo: 'gasovip@ejemplo.com' },
    { cedula: '0993374683001', nombre: 'GOLDENLOG S.A.', tipo: 'Jurídica', telefono: '0994569012', correo: 'goldenlog@ejemplo.com' },
    { cedula: '0992311762001', nombre: 'GONZAL S A', tipo: 'Jurídica', telefono: '0995670123', correo: 'gonzal@ejemplo.com' },
    { cedula: '0922875703001', nombre: 'GONZALES PAREDES LUIS ALFONSO', tipo: 'Natural', telefono: '0996781234', correo: 'gonzales@ejemplo.com' },
    { cedula: '0915647085001', nombre: 'GRANDA SUAREZ VERONICA ALEXANDRA', tipo: 'Natural', telefono: '0997892345', correo: 'granda@ejemplo.com' },
    { cedula: '1201886239001', nombre: 'GUILCAPI CAMACHO BLANCA NATIVIDAD', tipo: 'Natural', telefono: '0998903456', correo: 'guilcapi@ejemplo.com' },
    { cedula: '1709565707001', nombre: 'HERNAN CALDERÓN HERNÁN CALDERÓN', tipo: 'Natural', telefono: '0999014567', correo: 'hernan@ejemplo.com' },
    { cedula: '0992411686001', nombre: 'Hormicorp S. A.', tipo: 'Jurídica', telefono: '0990125678', correo: 'hormicorp@ejemplo.com' },
    { cedula: '0992573902001', nombre: 'HYDROMECANICA DEL ECUADOR SA HYDECUA', tipo: 'Jurídica', telefono: '0991236789', correo: 'hydromecanica@ejemplo.com' },
    { cedula: '0190491250001', nombre: 'ILLESCAS ALVARADO CONSTRU S.A.S.', tipo: 'Jurídica', telefono: '0992347890', correo: 'illescas@ejemplo.com' },
    { cedula: '0190319199001', nombre: 'IMPORMAVIZ CIA LTDA', tipo: 'Jurídica', telefono: '0993458901', correo: 'impormaviz@ejemplo.com' },
    { cedula: '0992226013001', nombre: 'IMPORTADORA SHINGS TRADING S.A.', tipo: 'Jurídica', telefono: '0994569012', correo: 'shings@ejemplo.com' },
    { cedula: '0993030767001', nombre: 'INMOCONSTRUMAJI S. A.', tipo: 'Jurídica', telefono: '0995670123', correo: 'inmoconstrumaji@ejemplo.com' },
    { cedula: '0927777896001', nombre: 'JEFFERSON ELIZALDE AVEIGA', tipo: 'Natural', telefono: '0996781234', correo: 'jefferson@ejemplo.com' },
    { cedula: '0990021058001', nombre: 'JUAN MARCET COMPA', tipo: 'Jurídica', telefono: '0997892345', correo: 'juan@ejemplo.com' },
    { cedula: '0990976643001', nombre: 'LA CHIRIPA CHIRS S.A.', tipo: 'Jurídica', telefono: '0998903456', correo: 'lachiripa@ejemplo.com' },
    { cedula: '1791110331001', nombre: 'LIBRERIA STUDIUM ALBAN BORJA', tipo: 'Jurídica', telefono: '0999014567', correo: 'libreria@ejemplo.com' },
    { cedula: '1791826507001', nombre: 'LOGISTICA ECUATORIANA S. A. LOGISTECSA', tipo: 'Jurídica', telefono: '0990125678', correo: 'logistecsa@ejemplo.com' },
    { cedula: '0991344098001', nombre: 'MACARVA CIA LTDA', tipo: 'Jurídica', telefono: '0991236789', correo: 'macarva@ejemplo.com' },
    { cedula: '0992655445001', nombre: 'Maconstma S. A.', tipo: 'Jurídica', telefono: '0992347890', correo: 'maconstma@ejemplo.com' },
    { cedula: '0990997934001', nombre: 'MAIOLI S.A.', tipo: 'Jurídica', telefono: '0993458901', correo: 'maioli@ejemplo.com' },
    { cedula: '0912219110001', nombre: 'Manuel Vinicio Sicha Abad', tipo: 'Natural', telefono: '0994569012', correo: 'manuel@ejemplo.com' },
    { cedula: '1801919000001', nombre: 'MARIA ELVIA SOLIS SOLIS', tipo: 'Natural', telefono: '0995670123', correo: 'maria@ejemplo.com' },
    { cedula: '0918971730001', nombre: 'MARIANA DE JESÚS VALLE CEDEÑO', tipo: 'Natural', telefono: '0996781234', correo: 'mariana@ejemplo.com' },
    { cedula: '1803585767001', nombre: 'MARTINEZ CORDOVILLA ANIBAL ARTURO', tipo: 'Natural', telefono: '0997892345', correo: 'arturo@ejemplo.com' },
    { cedula: '0993237760001', nombre: 'MATUCORRSA S. A.', tipo: 'Jurídica', telefono: '0998903456', correo: 'matucorrsa@ejemplo.com' },
    { cedula: '0993385138001', nombre: 'MAXFUEL S.A.S.', tipo: 'Jurídica', telefono: '0999014567', correo: 'maxfuel@ejemplo.com' },
    { cedula: '0992732458001', nombre: 'MAXICOMBUST S.A.', tipo: 'Jurídica', telefono: '0990125678', correo: 'maxicombust@ejemplo.com' },
    { cedula: '0190158616001', nombre: 'Minera Rookaazul Cia. Ltda.', tipo: 'Jurídica', telefono: '0991236789', correo: 'rookaazul@ejemplo.com' },
    { cedula: '0993152463001', nombre: 'MONTEOSCURO S.A.', tipo: 'Jurídica', telefono: '0992347890', correo: 'monteoscuro@ejemplo.com' },
    { cedula: '0602127847001', nombre: 'MONTES ESPINOZA CESAR GUILLERMO', tipo: 'Natural', telefono: '0993458901', correo: 'cesar@ejemplo.com' },
    { cedula: '0992390611001', nombre: 'MORINELY S. A.', tipo: 'Jurídica', telefono: '0994569012', correo: 'morinely@ejemplo.com' },
    { cedula: '0993062715001', nombre: 'MULTICOMERCIO MATUTE AYLLON MULTIMATUTE S.A.', tipo: 'Jurídica', telefono: '0995670123', correo: 'multicomercio@ejemplo.com' },
    { cedula: '1792291666001', nombre: 'NOVISOLUTIONS CIA. LTDA.', tipo: 'Jurídica', telefono: '0996781234', correo: 'novisolutions@ejemplo.com' },
    { cedula: '0991306498001', nombre: 'Nuevas Operaciones Comerciales NUCOPSA S.A.', tipo: 'Jurídica', telefono: '0997892345', correo: 'nucopsa@ejemplo.com' },
    { cedula: '0918358458001', nombre: 'OCHOA DIAZ ROXANA ELIZABETH', tipo: 'Natural', telefono: '0998903456', correo: 'roxana@ejemplo.com' },
    { cedula: '1791807529001', nombre: 'PAYLESS SHOESOURCE ECUADOR CIA. LTDA.', tipo: 'Jurídica', telefono: '0999014567', correo: 'payless@ejemplo.com' },
    { cedula: '0101518660001', nombre: 'Pedrito Rafael Pesantez Cordero', tipo: 'Natural', telefono: '0990125678', correo: 'pedrito@ejemplo.com' },
    { cedula: '0993279285001', nombre: 'Pepezone S.A.', tipo: 'Jurídica', telefono: '0991236789', correo: 'pepezone@ejemplo.com' },
    { cedula: '0993156779001', nombre: 'PERNOS LUMITEC PERLUMITEC S.A.', tipo: 'Jurídica', telefono: '0992347890', correo: 'perlumitec@ejemplo.com' },
    { cedula: '0926972951001', nombre: 'Peter Matute Jimenez', tipo: 'Natural', telefono: '0993458901', correo: 'peter@ejemplo.com' },
    { cedula: '0993012572001', nombre: 'PETROLMOTOR CA', tipo: 'Jurídica', telefono: '0994569012', correo: 'petrolmotor@ejemplo.com' },
    { cedula: '0993387290001', nombre: 'PETRONOBOA S.A.S.', tipo: 'Jurídica', telefono: '0995670123', correo: 'petronoboa@ejemplo.com' },
    { cedula: '0992301759001', nombre: 'PISONI S.A', tipo: 'Jurídica', telefono: '0996781234', correo: 'pisoni@ejemplo.com' },
    { cedula: '0990243891001', nombre: 'PRODUCTOS DEL PETROLEO SA PETROPORT', tipo: 'Jurídica', telefono: '0997892345', correo: 'petroport@ejemplo.com' },
    { cedula: '0992531355001', nombre: 'Produfuente S A', tipo: 'Jurídica', telefono: '0998903456', correo: 'produfuente@ejemplo.com' },
    { cedula: '0702599150001', nombre: 'PRYSCA', tipo: 'Natural', telefono: '0999014567', correo: 'prysca@ejemplo.com' },
    { cedula: '0990000530001', nombre: 'PYCCA S.A.', tipo: 'Jurídica', telefono: '0990125678', correo: 'pycca@ejemplo.com' },
    { cedula: '0100232461001', nombre: 'REINOSO ORELLANA MARIA CARMELINA', tipo: 'Natural', telefono: '0991236789', correo: 'maria@ejemplo.com' },
    { cedula: '0802326660001', nombre: 'REYES PADILLA VERONICA VANESSA', tipo: 'Natural', telefono: '0992347890', correo: 'veronica@ejemplo.com' },
    { cedula: '0903267011001', nombre: 'RUIZ VEGA TITO RENE', tipo: 'Natural', telefono: '0993458901', correo: 'tito@ejemplo.com' },
    { cedula: '0919690099001', nombre: 'Sabando Mendoza Lena Eliana', tipo: 'Natural', telefono: '0994569012', correo: 'lena@ejemplo.com' },
    { cedula: '0913764270001', nombre: 'SANCHEZ ANZULES RUBEN ENRIQUE', tipo: 'Natural', telefono: '0995670123', correo: 'ruben@ejemplo.com' },
    { cedula: '0913145470001', nombre: 'SANCHO ORELLANA RICARDO DAVID', tipo: 'Natural', telefono: '0996781234', correo: 'ricardo@ejemplo.com' },
    { cedula: '0922501119001', nombre: 'SEMANATE ANDRADE CARLOS ROBERTO', tipo: 'Natural', telefono: '0997892345', correo: 'carlos@ejemplo.com' },
    { cedula: '0993271772001', nombre: 'SERTECMOTOR S. A.', tipo: 'Jurídica', telefono: '0998903456', correo: 'sertecmotor@ejemplo.com' },
    { cedula: '0992639075001', nombre: 'SERVIDECONS S. A.', tipo: 'Jurídica', telefono: '0999014567', correo: 'servidecons@ejemplo.com' },
    { cedula: '0990988838001', nombre: 'SERVITURIS C A', tipo: 'Jurídica', telefono: '0990125678', correo: 'servituris@ejemplo.com' },
    { cedula: '0950068627001', nombre: 'STEFANIA NOEMI LOJA MACIAS', tipo: 'Natural', telefono: '0991236789', correo: 'stefania@ejemplo.com' },
    { cedula: '1791413237001', nombre: 'SUPERDEPORTE S.A', tipo: 'Jurídica', telefono: '0992347890', correo: 'superdeporte@ejemplo.com' },
    { cedula: '0993387636001', nombre: 'SUPERMETAL SECOND SUMETALSEC S.A.S.', tipo: 'Jurídica', telefono: '0993458901', correo: 'sumetalsec@ejemplo.com' },
    { cedula: '0991390685001', nombre: 'TECNACON S. A.', tipo: 'Jurídica', telefono: '0994569012', correo: 'tecnacon@ejemplo.com' },
    { cedula: '0992808845001', nombre: 'Toyima S.A.', tipo: 'Jurídica', telefono: '0995670123', correo: 'toyima@ejemplo.com' },
    { cedula: '0902821214001', nombre: 'VICENTE EDUARDO LEON CASTRO', tipo: 'Natural', telefono: '0996781234', correo: 'vicente@ejemplo.com' },
    { cedula: '0992330465001', nombre: 'VILCONSA S.A', tipo: 'Jurídica', telefono: '0997892345', correo: 'vilconsa@ejemplo.com' },
    { cedula: '0604198101001', nombre: 'VILLA PILCO PATRICIA ISABEL', tipo: 'Natural', telefono: '0998903456', correo: 'villa@ejemplo.com' },
    { cedula: '0992560754001', nombre: 'ZUKALO S A', tipo: 'Jurídica', telefono: '0999014567', correo: 'zukalo@ejemplo.com' }
  ];

  getClientes() {
    return this.clientes;
  }

  addCliente(cliente: any) {
    this.clientes.push(cliente);
  }

  updateCliente(cliente: any) {
    const index = this.clientes.findIndex(c => c.cedula === cliente.cedula);
    if (index !== -1) {
      this.clientes[index] = { ...cliente };
    }
  }

  deleteCliente(cedula: string) {
    const index = this.clientes.findIndex(c => c.cedula === cedula);
    if (index !== -1) {
      this.clientes.splice(index, 1);
    }
  }
}
