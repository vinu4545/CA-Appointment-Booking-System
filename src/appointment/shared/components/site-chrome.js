export function renderStickyIcon() {
  return `
    <div class="sticky-icon">
      <a href="https://wa.me/+919665945287?text=I'm%20interested%20in%20your%20Services" class="Youtube">
        <img src="images/whatsapp-icon.png" class="img-fluid imghw" alt="WhatsApp"> Whatsapp
      </a>
    </div>
  `;
}

export function renderPublicHeader(activeHref = '') {
  return `
    <header class="main-header header-style-five">
      <div class="header-top">
        <div class="auto-container">
          <div class="inner-container clearfix">
            <div class="top-left">
              <ul class="contact-list clearfix">
                <li><i class="fa fa-envelope-o"></i> <a href="mailto:carushikeshaneray@gmail.com">carushikeshaneray@gmail.com</a></li>
                <li><i class="fa fa-phone"></i><a href="tel:+919665945287">+91 9665945287</a></li>
              </ul>
            </div>
            <div class="top-right">
              <div class="cart-box d-flex"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="header-upper">
        <div class="auto-container header-auto">
          <div class="clearfix">
            <div class="pull-left logo-box">
              <div class="logo"><a href="index.html"><img class="img1" src="images/logo.png" alt="SSAR & Co Chartered Accountant" title="SSAR & Co Chartered Accountant"></a></div>
            </div>
            <div class="nav-outer clearfix">
              <nav class="main-menu navbar-expand-md">
                <div class="navbar-header">
                  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                  </button>
                </div>
                <div class="navbar-collapse collapse clearfix" id="navbarSupportedContent">
                  <ul class="navigation clearfix">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li class="dropdown"><a href="#">Services</a>
                      <ul>
                        <li class="dropdown"><a href="#"> Audits</a>
                          <ul>
                            <li><a href="audit-under-income-tax-service.html">Audit Under Income Tax Act </a></li>
                            <li><a href="audit-under-companies-act.html">Audit Under Companies Act </a></li>
                            <li><a href="gst-tax-service-provider.html">GST Audit </a></li>
                            <li><a href="transfer-pricing-services.html">Transfer Pricing </a></li>
                          </ul>
                        </li>
                        <li><a href="taxation-matters-service.html">Taxation Matters </a></li>
                        <li><a href="secretarial-services.html"> Secretarial Services</a></li>
                        <li><a href="accounting-and-compliances-services.html">Accounting and Compliances</a></li>
                        <li><a href="outsource-bookkeeping-service.html">Outsource Bookkeeping Service </a></li>
                        <li class="dropdown"><a href="#">Others</a>
                          <ul>
                            <li><a href="business-consulting-services.html">Business Consulting </a></li>
                            <li><a href="lower-deduction-certificate.html">Lower Deduction Certificate(form 13) </a></li>
                            <li><a href="business-set-up-in-india.html">Business Set up In India </a></li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li><a href="industry-we-serve.html">Industry We Serve</a></li>
                    <li><a href="team.html">Team</a></li>
                    <li><a href="contact.html">Contact us</a></li>
                    <li class="${activeHref === 'book-appointment.html' ? 'current' : ''}"><a href="book-appointment.html">Book Appointment</a></li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div class="sticky-header">
        <div class="auto-container clearfix">
          <div class="logo pull-left">
            <a href="index.html" class="img-responsive"><img class="img1" src="images/sticky-logo.png" alt="SSAR & Co Chartered Accountant" title="SSAR & Co Chartered Accountant"></a>
          </div>
        </div>
      </div>
    </header>
  `;
}

export function renderPublicFooter() {
  return `
    <footer class="main-footer">
      <div class="auto-container">
        <div class="widgets-section">
          <div class="row clearfix">
            <div class="big-column col-lg-5 col-md-12 col-sm-12">
              <div class="row clearfix">
                <div class="footer-column col-lg-8 col-md-6 col-sm-12">
                  <div class="footer-widget logo-widget">
                    <h4 style="color:#fff;text-align:center;margin-bottom:0;">What people say about us!</h4>
                    <div class="footer-view">
                      <img src="images/reviews-img.png" alt="Reviews">
                      <a href="https://www.google.com/search?q=ca+rushikesh+aneray&rlz=1C1UEAD_enIN1027IN1030&oq=CA+Rushikesh+Aneray&gs_lcrp=EgZjaHJvbWUqCQgAECMYJxiKBTIJCAAQIxgnGIoFMgYIARBFGDwyBggCEEUYPDIGCAMQRRg90gEIMzM1NmowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0x3bc2b8675d684bd3:0xbba673d57b7f1753,3,,,,">
                        <button class="button-19" role="button">Write your reviews</button>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="footer-column col-lg-4 col-md-6 col-sm-12">
                  <div class="footer-widget links-widget">
                    <h4>Links</h4>
                    <ul class="list-link">
                      <li><a href="index.html">Home</a></li>
                      <li><a href="audit-under-income-tax-service.html">Services</a></li>
                      <li><a href="about.html">About us</a></li>
                      <li><a href="team.html">Team</a></li>
                      <li><a href="industry-we-serve.html">Industry We Serve</a></li>
                      <li><a href="contact.html">Contact us</a></li>
                      <li class="${activeHref === 'book-appointment.html' ? 'current' : ''}"><a href="book-appointment.html">Book Appointment</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="big-column col-lg-7 col-md-12 col-sm-12">
              <div class="row clearfix">
                <div class="footer-column col-lg-6 col-md-6 col-sm-12">
                  <div class="footer-widget links-widget">
                    <h4>Contact Us</h4>
                    <ul class="list-style-two">
                      <li><span class="icon fa fa-phone"></span><b>Call :</b><br><a href="tel:+919665945287">+91 9665945287</a></li>
                      <li><span class="icon fa fa-envelope"></span><b>Mail :</b><br><a href="mailto:carushikeshaneray@gmail.com">carushikeshaneray@gmail.com</a></li>
                      <li><span class="icon fa fa-home"></span><b>Address :</b><br>Shop No 06, Ground Floor, Shree Ganesh Ace Arcade, Near Kokne Chowk, Behind Mahindra Showroom, Pimple Saudagar, Pimpri- Chinchwad, Maharashtra 411017<br></li>
                    </ul>
                  </div>
                </div>
                <div class="footer-column col-lg-6 col-md-6 col-sm-12">
                  <div class="footer-widget gallery-widget">
                    <h4>Locate Us</h4>
                    <div class="widget-content">
                      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15123.394071618053!2d73.8189913!3d18.625882!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b8675d684bd3%3A0xbba673d57b7f1753!2sCA%20Rushikesh%20Aneray!5e0!3m2!1sen!2sin!4v1693308840484!5m2!1sen!2sin" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom" style="background-color:#000;">
        <div class="auto-container">
          <div class="row clearfix">
            <div class="copyright-column col-lg-6 col-md-6 col-sm-12">
              <div class="copyright">&copy; All rights reserved by <a href="#">SSAR & Co Chartered Accountant</a></div>
            </div>
            <div class="social-column col-lg-6 col-md-6 col-sm-12">
              <ul><li style="color:#fff;">Design & Developed By<a href="#"> Netcom Business Solutions Pvt. Ltd.</a></li></ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function mountPublicChrome({ headerTarget, footerTarget }) {
  if (headerTarget) headerTarget.innerHTML = renderStickyIcon() + renderPublicHeader();
  if (footerTarget) footerTarget.innerHTML = renderPublicFooter();
}
