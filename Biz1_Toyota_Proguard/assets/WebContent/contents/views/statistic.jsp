<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<%@include file="../include/header.jsp"%>
</head>

<body>
	<div data-role="none" id="sub_wrap">
		<!-- 헤더메뉴  -->
		<div data-role="header" id="sub_header">
			<%@include file="../include/menuPop.jsp"%>
			<h1 class="title">통계관리</h1>
			<button class="re" id="btn_reset">
				<span>초기화</span>
			</button>
		</div>
		<!-- 헤더메뉴 끝 -->

		<div data-role="content" id="sub_content">
			<div class="inner_con f_mt pb-5">
				<ul class="search_ul" id="tabContent">
					<li class="l_t"><a class="btn_tab on" value="1">사용자 별</a></li>
					<li class="l_t"><a class="btn_tab" value="2">딜러 별</a></li>
					<li><a class="btn_tab" value="3">차량 별</a></li>
				</ul>
				<table class="ymd wp_100">
					<tr>
						<td class="wp_50"><input type="text" name="" id="from"
							readonly></td>
						<td class="wp_50 pl_10"><input type="text" name="" id="to"
							readonly></td>
					</tr>
				</table>
				<p class="ta_c f_mt">
					<a class="cld_btn" id="btn_search">검색</a>
				</p>
			</div>
			<div class="inner_con f_mt">
				<div class="grp_top ta_c">
					<a class="grp_btn_left fl_l" id="btn_left">이전순위로</a> <span><span
						id="startRank">1</span>위 ~ <span id="endRank">10</span>위</span> <a
						class="grp_btn_right fl_r" id="btn_right">다음순위로</a>
				</div>

				<!-- 세로 막대 그래프 차트 -->
				<div class="grp_lap">
					<div class="grp_bg" id="graphContent">
						<ul>
							<li>200-</li>
							<li>400-</li>
							<li>600-</li>
							<li>800-</li>
							<li>1000-</li>
						</ul>
						<dl>
							<dt class="rankText">1위</dt>
							<dd>
								<div class="bar-red rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">2위</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">3위</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">4위</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">5위</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">6위</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">7위</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">8위</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">9위</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">10위</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
					</div>
				</div>
				<!-- //세로 막대 그래프 차트 -->

				<div class="grp_list pb-1_5">
					<ul id="listTemplate" style="display: none;">
						<li class="record"><span class="rank"></span> <span
							class="text1"></span> <span class="text2"></span> <span
							class="red count"></span></li>
					</ul>
				</div>
			</div>
		</div>
		<!-- /content -->
		<%@include file="../include/footer.jsp"%>
	</div>
	<!-- /page -->

</body>

</html>
