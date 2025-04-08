import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommandeService } from 'src/app/services/commande.service';
import { DatePipe } from '@angular/common';
import { Commande } from 'src/app/models/commande';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css'],
  providers: [DatePipe] // Ajoutez ceci si vous voulez le limiter à ce composant
})
export class FactureComponent implements OnInit {
  commande!: Commande;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCommande(+id);
    }
  }

  loadCommande(id: number): void {
    this.commandeService.getCommande(id).subscribe({
      next: (commande) => {
        this.commande = commande;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement', err);
        this.isLoading = false;
      }
    });
  }

  formatDate(date: string | undefined): string {
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '' : 'Non spécifiée';
  }

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  downloadPDF(): void {
    const data = this.pdfContent.nativeElement;

    html2canvas(data, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
      pdf.save(`facture_${new Date().getTime()}.pdf`);
    });
  }
}