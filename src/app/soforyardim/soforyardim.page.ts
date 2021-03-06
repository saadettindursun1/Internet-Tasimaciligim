import { Router } from '@angular/router';
import { soforServices } from './../services/soforServices';
import { FbserviceService } from './../services/fbservice.service';
import { Kayit } from './../models/kayit';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-soforyardim',
  templateUrl: './soforyardim.page.html',
  styleUrls: ['./soforyardim.page.scss'],
})
export class SoforyardimPage implements OnInit {

  konum: string;
  ariza: string;
  kayitlar: any;
  uid: string;
  rol: string;
  seckayit: Kayit = new Kayit();
  constructor(
    public Fbservice: FbserviceService,
    public Fbservis: soforServices,
    public router: Router
  ) { }
   
  KayitListele() {

    this.Fbservice.KayitListele().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.kayitlar = data;
    });

  }

  KayitListeleKonum(sehir:string) {

    this.Fbservice.KayitListelebyKonum(this.konum).snapshotChanges().subscribe(data => {
      this.kayitlar = [];
      data.forEach(satir => {
        var y = { ...satir.payload.toJSON(), key: satir.key };
        this.kayitlar.push(y as Kayit)
      })
    });

  }
  rolBak() {

    if (this.rol == "isletme") {
      this.router.navigate(['isveren/ilanpaylas']);
    }
    if (this.rol == "yolyardim") {
      this.router.navigate(['yolyardim']);
    }

  }

  OturumKapat() {
    this.Fbservis.OturumKapat().then(d => {
      localStorage.removeItem("user");
      this.router.navigate(['/sofor']);
    });
  }

  KayitListele2() {

    this.Fbservice.KayitListelebyUid(this.konum, this.ariza).snapshotChanges().subscribe(data => {
      this.kayitlar = [];
      data.forEach(satir => {
        var y = { ...satir.payload.toJSON(), key: satir.key };
        this.kayitlar.push(y as Kayit)
      })
    });

  }

  ngOnInit(): void {
    this.KayitListele();
    var user: any = JSON.parse(localStorage.getItem("user"));
    this.uid = user.uid;
    this.rol = user.displayName;
    this.rolBak();
  }

}
