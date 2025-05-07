// Updated footer with corrected layout, colors, fonts, spacing, and links
import React from "react";
import { Box, Typography, Button, Grid, Divider, Link as MuiLink } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#f7f8fa",
        color: "#121212",
        fontFamily: "Roboto, sans-serif",
        pt: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "54px",
          backgroundColor: "#2B2B4F",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          lineHeight: "16px",
          padding: "0 26px",
          textAlign: "center",
          marginBottom: "15px",
        }}
      >
        Информация о товаре предоставлена для ознакомления и не является
        публичной офертой. Производители оставляют за собой право изменять
        внешний вид, характеристики и комплектацию товара, предварительно не
        уведомляя продавцов и потребителей. Просим вас отнестись с пониманием к
        данному факту и заранее приносим извинения за возможные неточности в
        описании и фотографиях товара. Будем благодарны вам за сообщение об
        ошибках — это поможет сделать наш каталог еще точнее!
      </Box>

      <Box sx={{ px: { xs: 2, md: 10 }, maxWidth: "1600px", mx: "auto" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 500 }}>
                <img
                  src="/icons/life.svg"
                  alt="life icon"
                  style={{ verticalAlign: "middle", marginRight: 8 }}
                />
                8 (029) <b>111-11-11</b>
              </Typography>
              <Typography sx={{ fontWeight: 500, mt: 1 }}>
                <img
                  src="/icons/a1.svg"
                  alt="a1 icon"
                  style={{ verticalAlign: "middle", marginRight: 8 }}
                />
                8 (044) <b>111-11-11</b>
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#1c2340",
                    color: "#fff",
                    px: 3,
                    py: 1,
                    fontWeight: 500,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#12172b" },
                  }}
                >
                  Перезвонить
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#f1772d",
                    color: "#fff",
                    px: 3,
                    py: 1,
                    fontWeight: 500,
                    textTransform: "none",
                    boxShadow: "0px 4px 10px rgba(241, 119, 45, 0.3)",
                    "&:hover": { bgcolor: "#e66b23" },
                  }}
                >
                  Написать руководству
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
              <img src="/icons/24h.svg" alt="24" style={{ marginRight: 10 }} />
              <Typography fontWeight={600}>
                Онлайн заказы принимаются круглосуточно
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography fontWeight={600}>Обработка заказов</Typography>
              <Typography>Понедельник – Пятница 9.00 – 21.00</Typography>
              <Typography>Суббота 9.00 – 19.00</Typography>
              <Typography>Воскресенье 9.00 – 17.00</Typography>
              <Typography fontWeight={600} sx={{ mt: 2 }}>
                Выдача заказов (Минск и Гродно)
              </Typography>
              <Typography>Понедельник – Пятница 9.00 – 21.00</Typography>
              <Typography>Суббота 9.00 – 19.00</Typography>
              <Typography>Воскресенье 9.00 – 17.00</Typography>
              <Typography fontWeight={600} sx={{ mt: 2 }}>
                Выдача заказов (Могилев и Гомель)
              </Typography>
              <Typography>Понедельник – Суббота 9.00 – 19.00</Typography>
              <Typography>Воскресенье 9.00 – 17.00</Typography>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography fontWeight={700} mb={1}>Помощь</Typography>
            {['/brands', '/vin', '/sitemap', '/price', '/calculator'].map((href, i) => (
              <MuiLink key={i} href={href} underline="hover" color="inherit" display="block">
                {['Все марки авто', 'Запрос по VIN', 'Карта сайта', 'Прайс-лист', 'Шинный калькулятор'][i]}
              </MuiLink>
            ))}
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography fontWeight={700} mb={1}>О магазине</Typography>
            {['/about', '/contacts', '/reviews', '/news', '/articles', '/faq', '/jobs'].map((href, i) => (
              <MuiLink key={i} href={href} underline="hover" color="inherit" display="block">
                {['О компании', 'Контакты', 'Отзывы клиентов', 'Новости', 'Статьи', 'Вопрос-ответ', 'Вакансии'][i]}
              </MuiLink>
            ))}
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography fontWeight={700} mb={1}>Покупателям</Typography>
            {['/discounts', '/affiliate', '/payment', '/warranty', '/returns', '/offer', '/cookies', '/privacy', '/consumer-appeals'].map((href, i) => (
              <MuiLink key={i} href={href} underline="hover" color="inherit" display="block">
                {['Система скидок', 'Партнерская программа', 'Способы оплаты', 'Гарантия', 'Возврат товара', 'Публичная оферта', 'Обработка файлов cookies', 'Обработка персональных данных', 'Обращения потребителей'][i]}
              </MuiLink>
            ))}
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography fontWeight={700} mb={1}>Профиль</Typography>
            <MuiLink href="/login" underline="hover" color="inherit" display="block">Вход</MuiLink>
            <MuiLink href="/register" underline="hover" color="inherit" display="block">Регистрация</MuiLink>
            <Typography fontWeight={700} mt={4}>Мы в соц. сетях</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              {['vk', 'youtube', 'instagram', 'telegram'].map((icon) => (
                <MuiLink key={icon} href="#" underline="none">
                  <img src={`/icons/${icon}.svg`} alt={icon} />
                </MuiLink>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Box
            sx={{
              bgcolor: "#fff",
              px: 3,
              py: 1.5,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <Typography>
              Рейтинг магазина: <span style={{ color: "#121212", fontWeight: 600 }}>
                <img
                  src="/icons/star.svg"
                  alt="star"
                  style={{ verticalAlign: "middle", marginRight: 4 }}
                /> 4.9
              </span> из 5 &nbsp; 1255 Отзывов
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4, bgcolor: "#e0e0e0" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "flex-start",
            pb: 6,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              2020 © autoostrov.by — <b>zakaz@autoostrov.by</b>
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={1200} mt={1}>
              Общество с ограниченной ответственностью «Ластад-М», 220076, г. Минск, ул. Петра Мстиславца, дом 5, офис 206, УНП 192793177. <br />
              Зарегистрировано Минским горисполкомом 27.03.2017г. в ЕГР за номером 192793177. Регистрация в Государственном Торговом Реестре 22.05.2017, регистрационный № 382265 <br />
              Кусков Сергей Викторович <b>+375-44-731-25-77</b> Электронная почта <b>375297772657@mail.ru</b> — лицо, уполномоченное продавцом рассматривать обращения покупателей о нарушении их прав, предусмотренных законодательством о защите прав потребителей <br />
              Отдел торговли и услуг администрации Первомайского района города Минска: 8-017-215-17-40, 8-017-215-26-26, 8-017-215-14-65 <br />
              местный исполнительный и распорядительный орган по месту государственной регистрации, уполномоченный рассматривать обращения покупателей в соответствии с законодательством об обращениях граждан и юридических лиц
            </Typography>
            <Box sx={{ mt: 2 }}>
              <img src="/icons/payments.svg" alt="payment systems" />
            </Box>
          </Box>
          <Box>
            <img src="/icons/adata.svg" alt="adata" style={{ marginTop: 20 }} />
            <Typography variant="body2" color="text.secondary" align="right">
              Разработка магазина автозапчастей
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%", height: "54px", backgroundColor: "#2B2B4F" }} />
    </Box>
  );
};

export default Footer;
