import { Injectable } from '@angular/core';
import { EscalaRow, Estamento } from '../models/types';

const ESCALA_KEY = 'unesie_escala_v1';

const ESCALA_2026: EscalaRow[] = [
  {"grado":1,"estamento":"Directivo","sueldo_base":974926,"incremento_dl3501":127228,"asig_fiscalizacion":3663984,"bon_salud":131307,"bon_previsional":283382,"asig_unica":27369,"ley18091_art17":6587252,"asig_especial_art8":0,"asig_desempenio_fija":233314,"asig_desempenio_variable":307974,"rem_bruta":12336736,"anio":2026},
  {"grado":2,"estamento":"Directivo","sueldo_base":955022,"incremento_dl3501":124630,"asig_fiscalizacion":3322452,"bon_salud":132843,"bon_previsional":286403,"asig_unica":27369,"ley18091_art17":4919095,"asig_especial_art8":0,"asig_desempenio_fija":215242,"asig_desempenio_variable":284120,"rem_bruta":10267176,"anio":2026},
  {"grado":5,"estamento":"Directivo","sueldo_base":852238,"incremento_dl3501":111217,"asig_fiscalizacion":2656532,"bon_salud":140990,"bon_previsional":302097,"asig_unica":27369,"ley18091_art17":3157893,"asig_especial_art8":0,"asig_desempenio_fija":176807,"asig_desempenio_variable":233385,"rem_bruta":7658528,"anio":2026},
  {"grado":6,"estamento":"Directivo","sueldo_base":847191,"incremento_dl3501":110558,"asig_fiscalizacion":2399802,"bon_salud":144252,"bon_previsional":308844,"asig_unica":27748,"ley18091_art17":2143015,"asig_especial_art8":0,"asig_desempenio_fija":163737,"asig_desempenio_variable":216133,"rem_bruta":6361280,"anio":2026},
  {"grado":4,"estamento":"Profesional","sueldo_base":885378,"incremento_dl3501":115542,"asig_fiscalizacion":2829390,"bon_salud":138356,"bon_previsional":297056,"asig_unica":27369,"ley18091_art17":2488895,"asig_especial_art8":0,"asig_desempenio_fija":187107,"asig_desempenio_variable":246981,"rem_bruta":7216074,"anio":2026},
  {"grado":5,"estamento":"Profesional","sueldo_base":852238,"incremento_dl3501":111217,"asig_fiscalizacion":2656532,"bon_salud":140990,"bon_previsional":302097,"asig_unica":27369,"ley18091_art17":1403508,"asig_especial_art8":0,"asig_desempenio_fija":176807,"asig_desempenio_variable":233385,"rem_bruta":5904143,"anio":2026},
  {"grado":6,"estamento":"Profesional","sueldo_base":847191,"incremento_dl3501":110558,"asig_fiscalizacion":2399802,"bon_salud":144252,"bon_previsional":308844,"asig_unica":27748,"ley18091_art17":1298797,"asig_especial_art8":0,"asig_desempenio_fija":163737,"asig_desempenio_variable":216133,"rem_bruta":5517062,"anio":2026},
  {"grado":7,"estamento":"Profesional","sueldo_base":830388,"incremento_dl3501":108366,"asig_fiscalizacion":2237699,"bon_salud":145606,"bon_previsional":311398,"asig_unica":27748,"ley18091_art17":1073831,"asig_especial_art8":0,"asig_desempenio_fija":154792,"asig_desempenio_variable":204325,"rem_bruta":5094153,"anio":2026},
  {"grado":8,"estamento":"Profesional","sueldo_base":796790,"incremento_dl3501":103981,"asig_fiscalizacion":2036064,"bon_salud":150971,"bon_previsional":320865,"asig_unica":27748,"ley18091_art17":991499,"asig_especial_art8":0,"asig_desempenio_fija":143030,"asig_desempenio_variable":188800,"rem_bruta":4759748,"anio":2026},
  {"grado":9,"estamento":"Profesional","sueldo_base":773222,"incremento_dl3501":100905,"asig_fiscalizacion":1865237,"bon_salud":138144,"bon_previsional":339149,"asig_unica":27748,"ley18091_art17":923461,"asig_especial_art8":0,"asig_desempenio_fija":133310,"asig_desempenio_variable":175970,"rem_bruta":4477146,"anio":2026},
  {"grado":10,"estamento":"Profesional","sueldo_base":753063,"incremento_dl3501":98275,"asig_fiscalizacion":1723411,"bon_salud":127531,"bon_previsional":326379,"asig_unica":27748,"ley18091_art17":742943,"asig_especial_art8":0,"asig_desempenio_fija":125211,"asig_desempenio_variable":165279,"rem_bruta":4089840,"anio":2026},
  {"grado":11,"estamento":"Profesional","sueldo_base":705574,"incremento_dl3501":92077,"asig_fiscalizacion":1521108,"bon_salud":112294,"bon_previsional":272439,"asig_unica":28271,"ley18091_art17":668004,"asig_especial_art8":0,"asig_desempenio_fija":112748,"asig_desempenio_variable":148827,"rem_bruta":3661342,"anio":2026},
  {"grado":12,"estamento":"Profesional","sueldo_base":654184,"incremento_dl3501":85371,"asig_fiscalizacion":1309622,"bon_salud":96436,"bon_previsional":233935,"asig_unica":28271,"ley18091_art17":589142,"asig_especial_art8":4771,"asig_desempenio_fija":99842,"asig_desempenio_variable":131792,"rem_bruta":3233366,"anio":2026},
  {"grado":13,"estamento":"Profesional","sueldo_base":606270,"incremento_dl3501":79118,"asig_fiscalizacion":1125380,"bon_salud":82607,"bon_previsional":200401,"asig_unica":28271,"ley18091_art17":519495,"asig_especial_art8":9077,"asig_desempenio_fija":88450,"asig_desempenio_variable":116754,"rem_bruta":2855823,"anio":2026},
  {"grado":14,"estamento":"Profesional","sueldo_base":561743,"incremento_dl3501":73307,"asig_fiscalizacion":973183,"bon_salud":71178,"bon_previsional":172700,"asig_unica":28271,"ley18091_art17":460478,"asig_especial_art8":11502,"asig_desempenio_fija":78735,"asig_desempenio_variable":103930,"rem_bruta":2535027,"anio":2026},
  {"grado":15,"estamento":"Profesional","sueldo_base":520641,"incremento_dl3501":67944,"asig_fiscalizacion":839032,"bon_salud":61158,"bon_previsional":148317,"asig_unica":28271,"ley18091_art17":353515,"asig_especial_art8":13300,"asig_desempenio_fija":70062,"asig_desempenio_variable":92482,"rem_bruta":2194722,"anio":2026},
  {"grado":16,"estamento":"Profesional","sueldo_base":414443,"incremento_dl3501":54085,"asig_fiscalizacion":776416,"bon_salud":56483,"bon_previsional":136303,"asig_unica":28271,"ley18091_art17":309623,"asig_especial_art8":16384,"asig_desempenio_fija":61776,"asig_desempenio_variable":81544,"rem_bruta":1935328,"anio":2026},
  {"grado":17,"estamento":"Profesional","sueldo_base":383612,"incremento_dl3501":50061,"asig_fiscalizacion":551054,"bon_salud":39579,"bon_previsional":95983,"asig_unica":28271,"ley18091_art17":243013,"asig_especial_art8":14843,"asig_desempenio_fija":48889,"asig_desempenio_variable":64533,"rem_bruta":1519838,"anio":2026},
  {"grado":10,"estamento":"Fiscalizador","sueldo_base":753063,"incremento_dl3501":98275,"asig_fiscalizacion":1723411,"bon_salud":127531,"bon_previsional":326379,"asig_unica":27748,"ley18091_art17":866766,"asig_especial_art8":0,"asig_desempenio_fija":125211,"asig_desempenio_variable":165279,"rem_bruta":4213663,"anio":2026},
  {"grado":11,"estamento":"Fiscalizador","sueldo_base":705574,"incremento_dl3501":92077,"asig_fiscalizacion":1521108,"bon_salud":112294,"bon_previsional":272439,"asig_unica":28271,"ley18091_art17":779338,"asig_especial_art8":0,"asig_desempenio_fija":112748,"asig_desempenio_variable":148827,"rem_bruta":3772676,"anio":2026},
  {"grado":12,"estamento":"Fiscalizador","sueldo_base":654184,"incremento_dl3501":85371,"asig_fiscalizacion":1309622,"bon_salud":96436,"bon_previsional":233935,"asig_unica":28271,"ley18091_art17":589142,"asig_especial_art8":4771,"asig_desempenio_fija":99842,"asig_desempenio_variable":131792,"rem_bruta":3233366,"anio":2026},
  {"grado":13,"estamento":"Fiscalizador","sueldo_base":606270,"incremento_dl3501":79118,"asig_fiscalizacion":1125380,"bon_salud":82607,"bon_previsional":200401,"asig_unica":28271,"ley18091_art17":519495,"asig_especial_art8":9077,"asig_desempenio_fija":88450,"asig_desempenio_variable":116754,"rem_bruta":2855823,"anio":2026},
  {"grado":14,"estamento":"Fiscalizador","sueldo_base":561743,"incremento_dl3501":73307,"asig_fiscalizacion":973183,"bon_salud":71178,"bon_previsional":172700,"asig_unica":28271,"ley18091_art17":460478,"asig_especial_art8":11502,"asig_desempenio_fija":78735,"asig_desempenio_variable":103930,"rem_bruta":2535027,"anio":2026},
  {"grado":15,"estamento":"Fiscalizador","sueldo_base":520641,"incremento_dl3501":67944,"asig_fiscalizacion":839032,"bon_salud":61158,"bon_previsional":148317,"asig_unica":28271,"ley18091_art17":353515,"asig_especial_art8":13300,"asig_desempenio_fija":70062,"asig_desempenio_variable":92482,"rem_bruta":2194722,"anio":2026},
  {"grado":16,"estamento":"Fiscalizador","sueldo_base":414443,"incremento_dl3501":54085,"asig_fiscalizacion":776416,"bon_salud":56483,"bon_previsional":136303,"asig_unica":28271,"ley18091_art17":309623,"asig_especial_art8":16384,"asig_desempenio_fija":61776,"asig_desempenio_variable":81544,"rem_bruta":1935328,"anio":2026},
  {"grado":13,"estamento":"Técnico","sueldo_base":606270,"incremento_dl3501":79118,"asig_fiscalizacion":1125380,"bon_salud":82607,"bon_previsional":200401,"asig_unica":28271,"ley18091_art17":173165,"asig_especial_art8":9077,"asig_desempenio_fija":88450,"asig_desempenio_variable":116754,"rem_bruta":2509493,"anio":2026},
  {"grado":14,"estamento":"Técnico","sueldo_base":561743,"incremento_dl3501":73307,"asig_fiscalizacion":973183,"bon_salud":71178,"bon_previsional":172700,"asig_unica":28271,"ley18091_art17":306985,"asig_especial_art8":11502,"asig_desempenio_fija":78735,"asig_desempenio_variable":103930,"rem_bruta":2381534,"anio":2026},
  {"grado":15,"estamento":"Técnico","sueldo_base":520641,"incremento_dl3501":67944,"asig_fiscalizacion":839032,"bon_salud":61158,"bon_previsional":148317,"asig_unica":28271,"ley18091_art17":271934,"asig_especial_art8":13300,"asig_desempenio_fija":70062,"asig_desempenio_variable":92482,"rem_bruta":2113141,"anio":2026},
  {"grado":16,"estamento":"Técnico","sueldo_base":414443,"incremento_dl3501":54085,"asig_fiscalizacion":776416,"bon_salud":56483,"bon_previsional":136303,"asig_unica":28271,"ley18091_art17":238172,"asig_especial_art8":16384,"asig_desempenio_fija":61776,"asig_desempenio_variable":81544,"rem_bruta":1863877,"anio":2026},
  {"grado":17,"estamento":"Técnico","sueldo_base":383612,"incremento_dl3501":50061,"asig_fiscalizacion":551054,"bon_salud":39579,"bon_previsional":95983,"asig_unica":28271,"ley18091_art17":186933,"asig_especial_art8":14843,"asig_desempenio_fija":48889,"asig_desempenio_variable":64533,"rem_bruta":1463758,"anio":2026},
  {"grado":18,"estamento":"Técnico","sueldo_base":352767,"incremento_dl3501":46036,"asig_fiscalizacion":390318,"bon_salud":29029,"bon_previsional":73038,"asig_unica":91893,"ley18091_art17":148617,"asig_especial_art8":29718,"asig_desempenio_fija":43235,"asig_desempenio_variable":57070,"rem_bruta":1261721,"anio":2026},
  {"grado":19,"estamento":"Técnico","sueldo_base":328834,"incremento_dl3501":42913,"asig_fiscalizacion":262761,"bon_salud":20247,"bon_previsional":51719,"asig_unica":102096,"ley18091_art17":118319,"asig_especial_art8":19584,"asig_desempenio_fija":35664,"asig_desempenio_variable":47076,"rem_bruta":1029213,"anio":2026},
  {"grado":20,"estamento":"Técnico","sueldo_base":304823,"incremento_dl3501":39779,"asig_fiscalizacion":172936,"bon_salud":13766,"bon_previsional":35750,"asig_unica":101278,"ley18091_art17":105107,"asig_especial_art8":20335,"asig_desempenio_fija":29969,"asig_desempenio_variable":39559,"rem_bruta":863302,"anio":2026},
  {"grado":21,"estamento":"Técnico","sueldo_base":284289,"incremento_dl3501":37100,"asig_fiscalizacion":103719,"bon_salud":8658,"bon_previsional":22820,"asig_unica":91893,"ley18091_art17":97002,"asig_especial_art8":22818,"asig_desempenio_fija":25136,"asig_desempenio_variable":33179,"rem_bruta":726614,"anio":2026},
  {"grado":22,"estamento":"Técnico","sueldo_base":222649,"incremento_dl3501":29056,"asig_fiscalizacion":93526,"bon_salud":7960,"bon_previsional":20632,"asig_unica":85486,"ley18091_art17":79044,"asig_especial_art8":26933,"asig_desempenio_fija":21430,"asig_desempenio_variable":28287,"rem_bruta":615003,"anio":2026},
  {"grado":12,"estamento":"Administrativo","sueldo_base":654184,"incremento_dl3501":85371,"asig_fiscalizacion":1309622,"bon_salud":96436,"bon_previsional":233935,"asig_unica":28271,"ley18091_art17":78552,"asig_especial_art8":4771,"asig_desempenio_fija":99842,"asig_desempenio_variable":131792,"rem_bruta":2722776,"anio":2026},
  {"grado":13,"estamento":"Administrativo","sueldo_base":606270,"incremento_dl3501":79118,"asig_fiscalizacion":1125380,"bon_salud":82607,"bon_previsional":200401,"asig_unica":28271,"ley18091_art17":69266,"asig_especial_art8":9077,"asig_desempenio_fija":88450,"asig_desempenio_variable":116754,"rem_bruta":2405594,"anio":2026},
  {"grado":14,"estamento":"Administrativo","sueldo_base":561743,"incremento_dl3501":73307,"asig_fiscalizacion":973183,"bon_salud":71178,"bon_previsional":172700,"asig_unica":28271,"ley18091_art17":276286,"asig_especial_art8":11502,"asig_desempenio_fija":78735,"asig_desempenio_variable":103930,"rem_bruta":2350835,"anio":2026},
  {"grado":15,"estamento":"Administrativo","sueldo_base":520641,"incremento_dl3501":67944,"asig_fiscalizacion":839032,"bon_salud":61158,"bon_previsional":148317,"asig_unica":28271,"ley18091_art17":244741,"asig_especial_art8":13300,"asig_desempenio_fija":70062,"asig_desempenio_variable":92482,"rem_bruta":2085948,"anio":2026},
  {"grado":16,"estamento":"Administrativo","sueldo_base":414443,"incremento_dl3501":54085,"asig_fiscalizacion":776416,"bon_salud":56483,"bon_previsional":136303,"asig_unica":28271,"ley18091_art17":226264,"asig_especial_art8":16384,"asig_desempenio_fija":61776,"asig_desempenio_variable":81544,"rem_bruta":1851969,"anio":2026},
  {"grado":17,"estamento":"Administrativo","sueldo_base":383612,"incremento_dl3501":50061,"asig_fiscalizacion":551054,"bon_salud":39579,"bon_previsional":95983,"asig_unica":28271,"ley18091_art17":186933,"asig_especial_art8":14843,"asig_desempenio_fija":48889,"asig_desempenio_variable":64533,"rem_bruta":1463758,"anio":2026},
  {"grado":18,"estamento":"Administrativo","sueldo_base":352767,"incremento_dl3501":46036,"asig_fiscalizacion":390318,"bon_salud":29029,"bon_previsional":73038,"asig_unica":91893,"ley18091_art17":148617,"asig_especial_art8":29718,"asig_desempenio_fija":43235,"asig_desempenio_variable":57070,"rem_bruta":1261721,"anio":2026},
  {"grado":19,"estamento":"Administrativo","sueldo_base":328834,"incremento_dl3501":42913,"asig_fiscalizacion":262761,"bon_salud":20247,"bon_previsional":51719,"asig_unica":102096,"ley18091_art17":118319,"asig_especial_art8":19584,"asig_desempenio_fija":35664,"asig_desempenio_variable":47076,"rem_bruta":1029213,"anio":2026},
  {"grado":20,"estamento":"Administrativo","sueldo_base":304823,"incremento_dl3501":39779,"asig_fiscalizacion":172936,"bon_salud":13766,"bon_previsional":35750,"asig_unica":101278,"ley18091_art17":105107,"asig_especial_art8":20335,"asig_desempenio_fija":29969,"asig_desempenio_variable":39559,"rem_bruta":863302,"anio":2026},
  {"grado":21,"estamento":"Administrativo","sueldo_base":284289,"incremento_dl3501":37100,"asig_fiscalizacion":103719,"bon_salud":8658,"bon_previsional":22820,"asig_unica":91893,"ley18091_art17":97002,"asig_especial_art8":22818,"asig_desempenio_fija":25136,"asig_desempenio_variable":33179,"rem_bruta":726614,"anio":2026},
  {"grado":22,"estamento":"Administrativo","sueldo_base":222649,"incremento_dl3501":29056,"asig_fiscalizacion":93526,"bon_salud":7960,"bon_previsional":20632,"asig_unica":85486,"ley18091_art17":79044,"asig_especial_art8":26933,"asig_desempenio_fija":21430,"asig_desempenio_variable":28287,"rem_bruta":615003,"anio":2026},
  {"grado":18,"estamento":"Auxiliar","sueldo_base":352767,"incremento_dl3501":46036,"asig_fiscalizacion":390318,"bon_salud":29029,"bon_previsional":73038,"asig_unica":91893,"ley18091_art17":148617,"asig_especial_art8":29718,"asig_desempenio_fija":43235,"asig_desempenio_variable":57070,"rem_bruta":1261721,"anio":2026},
  {"grado":19,"estamento":"Auxiliar","sueldo_base":328834,"incremento_dl3501":42913,"asig_fiscalizacion":262761,"bon_salud":20247,"bon_previsional":51719,"asig_unica":102096,"ley18091_art17":118319,"asig_especial_art8":19584,"asig_desempenio_fija":35664,"asig_desempenio_variable":47076,"rem_bruta":1029213,"anio":2026},
  {"grado":20,"estamento":"Auxiliar","sueldo_base":304823,"incremento_dl3501":39779,"asig_fiscalizacion":172936,"bon_salud":13766,"bon_previsional":35750,"asig_unica":101278,"ley18091_art17":105107,"asig_especial_art8":20335,"asig_desempenio_fija":29969,"asig_desempenio_variable":39559,"rem_bruta":863302,"anio":2026},
  {"grado":21,"estamento":"Auxiliar","sueldo_base":284289,"incremento_dl3501":37100,"asig_fiscalizacion":103719,"bon_salud":8658,"bon_previsional":22820,"asig_unica":91893,"ley18091_art17":97002,"asig_especial_art8":22818,"asig_desempenio_fija":25136,"asig_desempenio_variable":33179,"rem_bruta":726614,"anio":2026},
  {"grado":22,"estamento":"Auxiliar","sueldo_base":222649,"incremento_dl3501":29056,"asig_fiscalizacion":93526,"bon_salud":7960,"bon_previsional":20632,"asig_unica":85486,"ley18091_art17":79044,"asig_especial_art8":26933,"asig_desempenio_fija":21430,"asig_desempenio_variable":28287,"rem_bruta":615003,"anio":2026},
  {"grado":23,"estamento":"Auxiliar","sueldo_base":188388,"incremento_dl3501":24585,"asig_fiscalizacion":86656,"bon_salud":7517,"bon_previsional":19500,"asig_unica":85486,"ley18091_art17":68761,"asig_especial_art8":30496,"asig_desempenio_fija":19551,"asig_desempenio_variable":25808,"rem_bruta":556748,"anio":2026}
];

@Injectable({ providedIn: 'root' })
export class EscalaService {
  private escala: EscalaRow[] = [...ESCALA_2026];

  constructor() {
    const stored = localStorage.getItem(ESCALA_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as EscalaRow[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.escala = parsed;
        }
      } catch {}
    }
  }

  getEscala(): EscalaRow[] {
    return [...this.escala];
  }

  lookup(estamento: Estamento, grado: number): EscalaRow | undefined {
    return this.escala.find(r => r.estamento === estamento && r.grado === grado);
  }

  calcularDiff(
    desde: { estamento: Estamento; grado: number },
    hasta: { estamento: Estamento; grado: number }
  ): { rem_actual: number; rem_solicitada: number; diff_mensual: number; diff_anual: number; pct_incremento: number } | null {
    const rowDesde = this.lookup(desde.estamento, desde.grado);
    const rowHasta = this.lookup(hasta.estamento, hasta.grado);
    if (!rowDesde || !rowHasta) return null;
    const diff_mensual = rowHasta.rem_bruta - rowDesde.rem_bruta;
    return {
      rem_actual: rowDesde.rem_bruta,
      rem_solicitada: rowHasta.rem_bruta,
      diff_mensual,
      diff_anual: diff_mensual * 12,
      pct_incremento: rowDesde.rem_bruta > 0 ? (diff_mensual / rowDesde.rem_bruta) * 100 : 0,
    };
  }

  getGradosPorEstamento(estamento: Estamento): number[] {
    return this.escala
      .filter(r => r.estamento === estamento)
      .map(r => r.grado)
      .sort((a, b) => a - b);
  }

  replaceEscala(newEscala: EscalaRow[]): void {
    this.escala = [...newEscala];
    localStorage.setItem(ESCALA_KEY, JSON.stringify(newEscala));
  }
}
